require('dotenv/config')
const models =require('../models');
const Validator =require("fastest-validator");
const bcryptjs = require('bcryptjs');
const jwt =require('jsonwebtoken');
const {v4:uuidv4}=require('uuid');
const user = require('../models/user');
const constants = require('../constants/constants');
const e = require('express');
const AWS = require('aws-sdk');
const URL =require('url');

const LOGGER=require('../logger/logger');
const StatsD = require('node-statsd');
const db = require('../models');
client = new StatsD();
AWS.config.update({region:process.env.REGION});
const ddb = new AWS.DynamoDB.DocumentClient();

const sns = new AWS.SNS();
//used for signUp 
function signUp(req,res){
    LOGGER.info('User Sign Up process started');
   
    const user ={
        //create uuid for id
         id:uuidv4(),
         first_name:req.body.first_name,
         last_name:req.body.last_name,
         username:req.body.username,
         password:req.body.password,
         verified:false
        }

    //schema used for validation,start of validate
    const schema ={
        first_name:{type:"string",optional:false,min:"1",max:"100"},
        last_name:{type:"string",optional:false,min:"1",max:"100"},
        username:{type:"email",optional:false},
        password:{type:"string",optional:false,min:"1",max:"100"}
    }
    //call Validator
    const v =new Validator();
    const validationResponse=v.validate(user,schema);

    //if validate false then return message and result
    if(validationResponse!== true){
        LOGGER.warn('Validation failed,Bad Reques!');
        
        return res.status(400).json({
            message:"Validation failed,Bad Request",
            error:validationResponse
        })
    }// end of validate
    let user_signUp_start_time= Date.now();

    client.increment('signUp_counter');

    models.User.findOne({where:{username:req.body.username}}).then(result =>{
        //if find same email dont create
        if(result){
            LOGGER.warn('email already exists!');
            let user_signUp_end_time= Date.now();
            client.timing('timing_user_create',user_signUp_end_time - user_signUp_start_time);
            let db_user_signUp_end_time= Date.now();
            client.timing('timing_db_query_user_create',db_user_signUp_end_time - user_signUp_start_time);

            res.status(409).json({
                message:"email already exists!"
        }
        )}else{
            /*
            without same email create user and save password as hash number
            para function(err,salt) is callback 
            */
            bcryptjs.genSalt(10,function(err,salt){
             /*
             para function(err,hash) is callback 
             */
                 bcryptjs.hash(req.body.password,salt,function(err,hash){
                 //get res body save password as hash number
                    
                    user.password=hash;
                 //create user
                    models.User.create(user).then(result =>{
                        //create token
                        const token =jwt.sign({
                            username:user.username,
                            userId:user.id
                        },"secret" ,function(err,token){
                            LOGGER.info('User created successfully!');
                            //sns publish call lambda
                            let sns_message={Email:user.username};
                            sns_message=JSON.stringify(sns_message);
                            let sns_params={Message:sns_message,TopicArn:process.env.AWS_SNS};
                            sns.publish(sns_params,(err,sns_data) => {
                                if(err){
                                    LOGGER.warn('SNS publish err!');
                                }else{
                                    LOGGER.info('SNS publish successfully!');
                                }

                            });
                            let user_signUp_end_time= Date.now();
                            client.timing('timing_user_create',user_signUp_end_time - user_signUp_start_time);

                            let db_user_signUp_end_time= Date.now();
                            client.timing('timing_db_query_user_create',db_user_signUp_end_time - user_signUp_start_time);
                            //return message and user and token
                            res.status(201).json({
                                message:"User created successfully",
                                 //remove password form result
                                User:{
                                    "id":result.id,
                                    "first_name":result.first_name,
                                    "last_name":result.last_name,
                                    "username":result.username,
                                    "account_created":result.account_created,
                                    "account_updated":result.account_updated,
                                    "verified": false
                                },
                                token:token
                            })
                        })
                       /* res.status(201).json({
                        message:"User created successfully",
                        //remove password form result
                       User:{
                        "id":result.id,
                        "first_name":result.first_name,
                        "last_name":result.last_name,
                        "username":result.username,
                        "account_created":result.account_created,
                        "account_updated":result.account_updated
                        }
                     });*/
                    }).catch(error =>{
                        let user_signUp_end_time= Date.now();
                        client.timing('timing_user_create',user_signUp_end_time - user_signUp_start_time);
                    
                      res.status(500).json({
                       message:"Something went wrong",
                       error:error
                 });
            });
        });
    });
        }

    }).catch(error=>{
        let user_signUp_end_time= Date.now();
        client.timing('timing_user_create',user_signUp_end_time - user_signUp_start_time);
        res.status(500).json({
            message:"Something went wrong!",
            error:error
        }

            )
    });    
}


//used for login 
function logIn(req,res){
    const user ={

         username:req.body.username,
         password:req.body.password
        }

    //schema used for validation
    const schema ={
        username:{type:"email",optional:false},
        password:{type:"string",optional:false,min:"1",max:"100"}
    }
    //call Validator
    const v =new Validator();
    const validationResponse=v.validate(user,schema);

    //if validate false then return message and result
    if(validationResponse!== true){
        return res.status(400).json({
            message:"Validation failed",
            error:validationResponse
        })
    }
    //first find if have this email
    
    models.User.findOne({where:{username:req.body.username}}).then(user =>{
        if(user === null){
            return res.status(401).json({
                message:"Invalid credentials!"
            })
        }else if(user.verified == false){
            return res.status(401).json({
                message:"Please verified your email address first!"
            })
        }else{
            //valid email check password .token use JWT_KEY stored at ./nodemon.json 
            bcryptjs.compare(req.body.password,user.password,function(err,result){
                if(result){
                    //password true return token
                    const token =jwt.sign({
                        username:user.username,
                        userId:user.id
                    },"secret" ,function(err,token){
                        return res.status(200).json({
                            message:"Authentication successful!",
                            token:token,
                            verified_on:user.verified_on
                        })
                    })
                }else{
                    //password wrong
                    return res.status(401).json({
                        message:"Invalid credentials!"
                    })
                }
            })
        }
    }).catch(error=>{
        return res.status(500).json({
            message:"Something went wrong!"
        })
    });
}

/**
 * This function used to find one user by id
 * @param {*} req 
 * @param {*} res 
 */
 function show(req,res){
    LOGGER.info('User get process started');
    let user_get_start_time= Date.now();
     //get username from token
     client.increment('UserGet_counter');
    const username = req.userData.username;

    models.User.findOne({where:{username:username}}).then(result =>{
       if(result){
         if(result.verified == false){
            LOGGER.warn('Please verified your email address first');
            return res.status(401).json({
                message:"Please verified your email address first!"
            });
        }
        LOGGER.info('User get successful!');
        let user_get_end_time= Date.now();
        client.timing('timing_user_get_api',user_get_end_time - user_get_start_time);
        let db_user_get_end_time= Date.now();
        client.timing('timing_db_query_user_get',db_user_get_end_time - user_get_start_time);
           res.status(200).json({
            "id":result.id,
            "first_name":result.first_name,
            "last_name":result.last_name,
            "username":result.username,
            "account_created":result.account_created,
            "account_updated":result.account_updated,
            "verified": true,
            "verified_on": result.verified_on
           });
       }else{
        LOGGER.warn('User not found');
        let user_get_end_time= Date.now();
        client.timing('timing_user_get_api',user_get_end_time - user_get_start_time);
        let db_user_get_end_time= Date.now();
        client.timing('timing_db_query_user_get',db_user_get_end_time - user_get_start_time);
           res.status(404).json({
               message:"User not found"
           })
       }
    }).catch(error=>{
        let user_get_end_time= Date.now();
        client.timing('timing_user_get_api',user_get_end_time - user_get_start_time);
        return res.status(500).json({
            message:"Something went wrong!"
        })
    });
}

/**
 * This function used to update user info
 * @param {*} req 
 * @param {*} res 
 */
 async function update(req,res){
    LOGGER.info('User update process started');
    let user_update_start_time= Date.now();
     //get username from token
    const username =req.userData.username;
    //metrics
    client.increment('UserUpdate_counter');
    //if require para is null then return status 204
    if(req.body.first_name===undefined&&req.body.last_name===undefined&&req.body.password===undefined){
        LOGGER.warn('No content');
        
        let user_update_end_time= Date.now();
        client.timing('timing_user_update_api',user_update_end_time - user_update_start_time);

        return res.status(204).json({
            message:"No content"
        })
    }
    //if contain needn't item would return 400
    if(req.body.username===undefined&&req.body.id===undefined&&req.body.account_created===undefined&&req.body.account_updated===undefined){
        
    }else{
        LOGGER.warn('Bad request');

        let user_update_end_time= Date.now();
        client.timing('timing_user_update_api',user_update_end_time - user_update_start_time);

        return res.status(400).json({
            message:"Bad request"
        })
    }
    //
    const updatedUser ={
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        password:req.body.password 
    }
    //hold token
    //const userId =1;
    //schema used for validation
    const schema ={
        first_name:{type:"string",optional:true,min:"1",max:"100"},
        last_name:{type:"string",optional:true,min:"1",max:"100"},
        password:{type:"string",optional:true,min:"1",max:"100"},
        $$strict:true//no additional properties allowed
    }
    //call Validator
    const v =new Validator();
    const validationResponse=v.validate(updatedUser,schema);
    //if validate false then return message and result
    if(validationResponse!== true){
        LOGGER.warn('Validation failed');

        let user_update_end_time= Date.now();
        client.timing('timing_user_update_api',user_update_end_time - user_update_start_time);

        return res.status(400).json({
            message:"Validation failed",
            error:validationResponse
        })
    }

    //check if has update value than last time
  
    let check_Fname=true;
    let check_Lname=true;
    let check_password=true;
    let user=await models.User.findOne({where:{username:username}});
    //check user address if is verified
    if(user.verified == false){
        LOGGER.warn('Please verified your email address first');
        return res.status(401).json({
            message:"Please verified your email address first!"
        });
    }
    if(req.body.first_name===user.first_name||req.body.first_name===undefined){
        check_Fname=false;
    }
    if(req.body.last_name===user.last_name||req.body.last_name===undefined){
        check_Lname=false;
    }
    if(req.body.password===undefined){
        check_password=false;
    }else{
        let result=await bcryptjs.compare(req.body.password,user.password);
        if(result){
            check_password=false;
        }
    }
    
//if no value change return 205 and dont update
    if(check_Fname||check_Lname||check_password){

    }else{
        LOGGER.warn('No changed value,please change something');

        let user_update_end_time= Date.now();
        client.timing('timing_user_update_api',user_update_end_time - user_update_start_time);

        return res.status(205).json({
            message:"No changed value,please change something"
        })
    }
    //end of checking value changed
        
    


    /*can't use result because update return a number of affected rows(first parameter of result array)
    I should call findbypk to get return result
    */
   //this have time
   bcryptjs.genSalt(10,function(err,salt){
    /*
    para function(err,hash) is callback 
    */
        bcryptjs.hash(req.body.password,salt,function(err,hash){
        //get res body save password as hash number
            
        updatedUser.password=hash;


        

        //update 
           models.User.update(updatedUser,{where:{username:username}}).then(()=>{
                    console.log("test3")
                   return models.User.findOne({where:{username:username}})
           }).then(result =>{
            console.log("test4")
            LOGGER.info('User update successfully');

            let user_update_end_time= Date.now();
            client.timing('timing_user_update_api',user_update_end_time - user_update_start_time);

            let db_user_update_end_time= Date.now();
            client.timing('timing_db_query_user_update',db_user_update_end_time - user_update_start_time);

              return res.status(200).json({
               message:"User update successfully",
               //remove password form result
              User:{
               "id":result.id,
               "first_name":result.first_name,
               "last_name":result.last_name,
               "username":result.username,
               "account_created":result.account_created,
               "account_updated":result.account_updated,
               "verified": true,
               "verified_on": result.verified_on
              }
            });
           }).catch(error =>{

            let user_update_end_time= Date.now();
            client.timing('timing_user_update_api',user_update_end_time - user_update_start_time);

             return res.status(500).json({
              message:"Something went wrong",
              error:error
        });
   });
});
});
    


}

function verify(req,res){
    LOGGER.info("verify process start!");
    //get params form req.url
    let arg=URL.parse(req.url,true).query;
    console.log(arg.email);
    console.log(arg.token);
    let eParams = {
        Key: {
            'id': arg.email
        },
        TableName: 'csye6225-dynamoDb'
    };

    let updateVerified={
        verified: true,
        verified_on: (new Date).getTime() 
    }
    //get item form aws dynamodb table
    ddb.get(eParams, function (error, code) {
        var jsString = JSON.stringify(code);
        if (error) {
            console.log("Error",error);
        }
        else {
            if (Object.keys(code).length >= 0) {
                var flag = true;
                if(code.Item == undefined){flag = false;}else
                    if(code.Item.TimeToExist < (new Date).getTime()){flag = false;}
                
               
                // if have this email in table and token is not expire,set verified true
                //if don't have this email or token is expired,verified fall 
                if(flag){
                    // check token
                    if(code.Item.token == arg.token){

                    }else{
                        LOGGER.warn("Invalid Token!");
                        return res.status(401).json({
                            message:"Invalid Token!"
                        });
                    }
                    //console.log("Verified email address");
                    models.User.update(updateVerified,{where:{username:arg.email}}).then(()=>{
                        LOGGER.info('Verified email address');
                        return res.status(200).json({
                            message:"Verified email address!"
                        });
                    }).catch(error =>{
                        return res.status(500).json({
                            message:"Something went wrong",
                            error:error
                        });
                    });
                
                    
                }else{
                    LOGGER.info('Invalid email address or token is expired');
                    //console.log("Invalid email address or token is expired");
                    return res.status(401).json({
                        message:"Invalid email address or token is expired!"
                    });
                }
            
            }
        }
    });

}
/* function test(req,res){
    res.status(204).json({
        message:"No content"
    })
} */
async function rawQuery(req,res){
    let sql="show status like 'Ssl_version'";
   /*  db.sequelize.query(sql,null,{raw:true}).success(function(data){
        LOGGER.info(data);
        return res.status(200).json({
            message:data
        });
    }); */
    const [results,metadata]=await db.sequelize.query(sql);
    LOGGER.info(results);
    return res.status(200).json({
        message:results
    });
}

module.exports={
    signUp:signUp,
    logIn:logIn,
    show:show,
    update:update,
    verify:verify,
    rawQuery:rawQuery
}