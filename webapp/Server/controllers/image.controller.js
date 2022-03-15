require('dotenv/config')
const multer = require('multer')

const {v4:uuidv4}=require('uuid');
const AWS = require('aws-sdk');
const models =require('../models');
const Validator =require("fastest-validator");
const image = require('../models/image');
const fs=require('fs');
const { type } = require('os');

const LOGGER=require('../logger/logger');
const StatsD = require('node-statsd');
client = new StatsD();

AWS.config.update({region:process.env.REGION})

//for my laptop
/* const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
}) */
//for ec2 instance
const s3 = new AWS.S3();

//test function
function upload(req,res){
    
    
    /* let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `123`,
        Body: req.body
    }
    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }
        
        res.status(200).send(data)
    }) */

    console.log(req.headers['content-type']);
    res.status(200).send();
}

async function uploadImage(req,res){
    LOGGER.info('Image upload process started');

    let image_upload_start_time= Date.now();

    client.increment('ImageUpload_counter');
    //get username from token
    let userId =req.userData.userId;
    let username =req.userData.username;
    //set image id
    let imageId=uuidv4();
    
    let upload_data={};

    let checkUser=await models.User.findOne({where:{username:username}});
    //check user address if is verified
    if(checkUser.verified == false){
        LOGGER.info('Please verified your email address first');
        return res.status(401).json({
            message:"Please verified your email address first!"
        });
    }

    //get extension
    let originType = req.headers['content-type'];
    let divideType=originType.split("/");
    let extension=divideType[divideType.length - 1];
//check if already upload  image
    let item=await models.Image.findOne({where:{user_id:userId}});
    if(item){
        LOGGER.info('Image already exist');
        //update already exit pic
        let delete_file_name=item.file_name;
        let delete_myFile = delete_file_name.split(".");
        let delete_fileType = delete_myFile[delete_myFile.length - 1];
        //delete S3 object
        let delete_params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}.${delete_fileType}`,
        }
        await s3.deleteObject(delete_params, (error, data) => {
            //metrics
            let s3_image_upload_delete_end_time= Date.now();
            client.timing('timing_s3_delete_image_upload',s3_image_upload_delete_end_time - image_upload_start_time);
            if(error){
                //metrics
                let s3_image_upload_delete_end_time= Date.now();
                client.timing('timing_s3_delete_image_upload',s3_image_upload_delete_end_time - image_upload_start_time);
                res.status(500).send(error)
            }
        })
        models.Image.destroy({where:{user_id:userId}}).then(result =>{
            
        }).catch(error =>{
            res.status(500).json({
                message:"Something went wrong!",
            })
        })
        //create object 
        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}.${extension}`,
            Body: req.body
        }
        await s3.upload(params, (error, data) => {

            let s3_image_upload_add_end_time= Date.now();
            client.timing('timing_s3_add_image_upload',s3_image_upload_add_end_time - image_upload_start_time);
            if(error){
                let s3_image_upload_add_end_time= Date.now();
                client.timing('timing_s3_add_image_upload',s3_image_upload_add_end_time - image_upload_start_time);
                res.status(500).send(error)
            }
            upload_data=data;
            //res.status(200).send(data)
        })
        let image ={
            id:imageId,
            user_id:userId,
            url:`${process.env.AWS_BUCKET_NAME}/${userId}.${extension}`,
            file_name:`${userId}.${extension}`
        }
    
        models.Image.create(image).then(item =>{
            LOGGER.info('Image updated successfully');

            let image_upload_end_time= Date.now();
            client.timing('timing_image_upload_api',image_upload_end_time - image_upload_start_time);

            let db_image_upload_end_time= Date.now();
            client.timing('timing_db_query_image_upload',db_image_upload_end_time - image_upload_start_time);

             res.status(201).json({
                message:"Image updated successfully",
                "file_name":item.file_name,
                "id":item.id,
                "url":item.url,
                "upload_date":item.upload_date,
                "user_id":item.user_id
             });
        }).catch(error =>{
            let image_upload_end_time= Date.now();
            client.timing('timing_image_upload_api',image_upload_end_time - image_upload_start_time);
            res.status(500).json({
                message:"Something went wrong",
                error:error
             });
        });
    
    }else{
        //upload to S3 and get return data
    let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${userId}.${extension}`,
        Body: req.body
    }
    await s3.upload(params, (error, data) => {
        let s3_image_upload_add_end_time= Date.now();
        client.timing('timing_s3_add_image_upload',s3_image_upload_add_end_time - image_upload_start_time);
        if(error){
            let s3_image_upload_add_end_time= Date.now();
            client.timing('timing_s3_add_image_upload',s3_image_upload_add_end_time - image_upload_start_time);
            res.status(500).send(error)
        }
        upload_data=data;
        //res.status(200).send(data)
    })

    let image ={
        id:imageId,
        user_id:userId,
        url:`${process.env.AWS_BUCKET_NAME}/${userId}.${extension}`,
        file_name:`${userId}.${extension}`
    }

    models.Image.create(image).then(item =>{
        LOGGER.info('Image created successfully');

        let image_upload_end_time= Date.now();
        client.timing('timing_image_upload_api',image_upload_end_time - image_upload_start_time);

        let db_image_upload_end_time= Date.now();
        client.timing('timing_db_query_image_upload',db_image_upload_end_time - image_upload_start_time);

         res.status(201).json({
            message:"Image created successfully",
            "file_name":item.file_name,
            "id":item.id,
            "url":item.url,
            "upload_date":item.upload_date,
            "user_id":item.user_id
         });
    }).catch(error =>{
        let image_upload_end_time= Date.now();
        client.timing('timing_image_upload_api',image_upload_end_time - image_upload_start_time);
        return res.status(500).json({
            message:"Something went wrong",
            error:error
         });
    });

    }
    
}

/* async function uploadImage(req,res){

    //get username from token
    let userId =req.userData.userId;
    let imageId=uuidv4();
    let file_name=req.file.originalname;
    let upload_data={};

    let myFile = req.file.originalname.split(".")
    let fileType = myFile[myFile.length - 1]
//check if upload same image
    let item=await models.Image.findOne({where:{user_id:userId}});
    if(item){
        //update already exit pic
        let delete_file_name=item.file_name;
        let delete_myFile = delete_file_name.split(".");
        let delete_fileType = delete_myFile[delete_myFile.length - 1];
        //delete S3 object
        let delete_params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}.${delete_fileType}`,
        }
        s3.deleteObject(delete_params, (error, data) => {
            if(error){
                res.status(500).send(error)
            }
        })
        models.Image.destroy({where:{user_id:userId}}).then(result =>{
            
        }).catch(error =>{
            res.status(500).json({
                message:"Something went wrong!",
            })
        })
        //create object 
        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}.${fileType}`,
            Body: req.file.buffer
        }
        s3.upload(params, (error, data) => {
            if(error){
                res.status(500).send(error)
            }
            upload_data=data;
            //res.status(200).send(data)
        })
        let image ={
            id:imageId,
            user_id:userId,
            url:`${process.env.AWS_BUCKET_NAME}/${userId}.${fileType}`,
            file_name:file_name
        }
    
        models.Image.create(image).then(item =>{
             res.status(201).json({
                message:"Image created successfully",
                "file_name":item.file_name,
                "id":item.id,
                "url":item.url,
                "upload_date":item.upload_date,
                "user_id":item.user_id
             });
        }).catch(error =>{
            res.status(500).json({
                message:"Something went wrong",
                error:error
             });
        });
    
    }else{
        //upload to S3 and get return data
    let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${userId}.${fileType}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }
        upload_data=data;
        //res.status(200).send(data)
    })

    let image ={
        id:imageId,
        user_id:userId,
        url:`${process.env.AWS_BUCKET_NAME}/${userId}.${fileType}`,
        file_name:file_name
    }

    models.Image.create(image).then(item =>{
         res.status(201).json({
            message:"Image created successfully",
            "file_name":item.file_name,
            "id":item.id,
            "url":item.url,
            "upload_date":item.upload_date,
            "user_id":item.user_id
         });
    }).catch(error =>{
        res.status(500).json({
            message:"Something went wrong",
            error:error
         });
    });

    }
    
} */

async function deleteImage(req,res){

    LOGGER.info('Image delete process started');
    client.increment('ImageDelete_counter');
    let image_delete_start_time= Date.now();
    //get userid from token
    let userId =req.userData.userId;
    let username =req.userData.username;
    
    let upload_data={};
    
    let file_name="";
    
    let checkUser=await models.User.findOne({where:{username:username}});
    //check user address if is verified
    if(checkUser.verified == false){
        LOGGER.info('Please verified your email address first');
        return res.status(401).json({
            message:"Please verified your email address first!"
        });
    }

    
//check if user have image
    let item=await models.Image.findOne({where:{user_id:userId}});
    if(item){
        file_name=item.file_name;
        let db_find_image_delete_end_time= Date.now();
        client.timing('timing_db_find_image_delete',db_find_image_delete_end_time - image_delete_start_time);
        
        

    }else{
        LOGGER.warn('you dont have a profile picture');

        let image_delete_end_time= Date.now();
        client.timing('timing_image_delete_api',image_delete_end_time - image_delete_start_time);

        let db_find_image_delete_end_time= Date.now();
        client.timing('timing_db_find_image_delete',db_find_image_delete_end_time - image_delete_start_time);

        return res.status(404).json({
            message:"you don't have a profile picture"
        })
    }

    let myFile = file_name.split(".");
    let fileType = myFile[myFile.length - 1];
    //upload to S3 and get return data
    let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${userId}.${fileType}`,
    }
    s3.deleteObject(params, (error, data) => {

        let s3_image_delete_end_time= Date.now();
        client.timing('timing_s3_delete_image_delete',s3_image_delete_end_time - image_delete_start_time);

        if(error){
            let s3_image_delete_end_time= Date.now();
            client.timing('timing_s3_delete_image_delete',s3_image_delete_end_time - image_delete_start_time);
            res.status(500).send(error)
        }
        //res.status(200).send(data)
    })

    models.Image.destroy({where:{user_id:userId}}).then(result =>{
        LOGGER.info('delete successfully');

        let image_delete_end_time= Date.now();
        client.timing('timing_image_delete_api',image_delete_end_time - image_delete_start_time);
        let db_image_delete_end_time= Date.now();
        client.timing('timing_db_query_image_delete',db_image_delete_end_time - image_delete_start_time);

        res.status(200).json({
            message:"delete successfully",
            })
    }).catch(error =>{
        let image_delete_end_time= Date.now();
        client.timing('timing_image_delete_api',image_delete_end_time - image_delete_start_time);

        res.status(500).json({
            message:"Something went wrong!",
        })
    })
    
}

async function getImage(req,res){
    LOGGER.info('Image get process started');

    client.increment('ImageGet_counter');

    let image_get_start_time= Date.now();
    //get userid from token
    let userId =req.userData.userId;
    let username =req.userData.username;
    
    let upload_data={};
    let imageId="";
    let file_name="";

    let checkUser=await models.User.findOne({where:{username:username}});
    //check user address if is verified
    if(checkUser.verified == false){
        LOGGER.info('Please verified your email address first');
        return res.status(401).json({
            message:"Please verified your email address first!"
        });
    }
    
//check if user have image
    let item=await models.Image.findOne({where:{user_id:userId}});
    if(item){
        LOGGER.info('Image get successfully');

        let image_get_end_time= Date.now();
        client.timing('timing_image_get_api',image_get_end_time - image_get_start_time);

        let db_image_get_end_time= Date.now();
        client.timing('timing_db_query_image_get',db_image_get_end_time - image_get_start_time);

        res.status(200).json({
            message:"Image get successfully",
            "file_name":item.file_name,
            "id":item.id,
            "url":item.url,
            "upload_date":item.upload_date,
            "user_id":item.user_id
         });

    }else{
        LOGGER.warn('you dont have a profile picture');
        let image_get_end_time= Date.now();
        client.timing('timing_image_get_api',image_get_end_time - image_get_start_time);
        let db_image_get_end_time= Date.now();
        client.timing('timing_db_query_image_get',db_image_get_end_time - image_get_start_time);

        return res.status(404).json({
            message:"you don't have a profile picture"
        })
    }

    
     
    
}

module.exports={
    upload:upload,
    deleteImage:deleteImage,
    uploadImage:uploadImage,
    getImage:getImage

}