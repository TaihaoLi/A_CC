//this file is used for test code

const models =require('../models');
const Validator =require("fastest-validator");

/**
 * Function used to POST save post
 * @param {*} req include body
 * @param {*} res server res
 */
function save(req,res){
    //get content from req
    const post ={
        title:req.body.title,
        content:req.body.content,
        imageUrl:req.body.image_url,
        categoryId:req.body.category_id,
        userId:1
    }
    /* //schema used for validation
    const schema ={
        title:{type:"string",optional:false,max:"100"},
        content:{type:"string",optional:false,max:"500"},
        categoryId:{type:"string",optional:false}
    }
    //call Validator
    const v =new Validator();
    const validationResponse=v.validate(post,schema);

    //if validate false then return message and result
    if(validationResponse!== true){
        return res.status(400).json({
            message:"Validation failed",
            error:validationResponse
        })
    } */

    models.Post.create(post).then(result =>{
         res.status(201).json({
            message:"Post created successfully",
            post:result
         });
    }).catch(error =>{
        res.status(500).json({
            message:"Something went wrong",
            error:error
         });
    });
}
/**
 * This function used to find one post by id
 * @param {*} req 
 * @param {*} res 
 */
function show(req,res){
    const id = req.params.id;

    models.Post.findByPk(id).then(result =>{
       if(result){
           res.status(200).json(result);
       }else{
           res.status(404).json({
               message:"Post not found"
           })
       }
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!"
        })
    });
}
/**
 * This function used to find all post
 * @param {*} req 
 * @param {*} res 
 */
function index(req,res){
    models.Post.findAll().then(result =>{
        res.status(200).json(result);
    }).catch(error =>{
        res.status(500).json({
            message:"Something went wrong!"
        })
    })
}

/**
 * This function used to update
 * @param {*} req 
 * @param {*} res 
 */
function update(req,res){
    const id =req.params.id;
    const updatedPost ={
        title:req.body.title,
        content:req.body.content,
        imageUrl:req.body.image_url,
        categoryId:req.body.category_id,  
    }
    //hold token
    const userId =1;
    //schema used for validation
    const schema ={
        title:{type:"string",optional:false,max:"100"},
        content:{type:"string",optional:false,max:"500"},
        categoryId:{type:"string",optional:false}
    }
    //call Validator
    const v =new Validator();
    const validationResponse=v.validate(updatedPost,schema);
    //if validate false then return message and result
    if(validationResponse!== true){
        return res.status(400).json({
            message:"Validation failed",
            error:validationResponse
        })
    }

//can't use result as result,because it returns a number of affected rows(first parameter of result array)
//below dont have time
    /* models.Post.update(updatedPost,{where:{id:id,userId:userId}}).then(result =>{
        res.status(200).json({
            message:"update successfully",
            post:updatedPost})
    }).catch(error =>{
        res.status(500).json({
            message:"Something went wrong!",
        })
    }) */

    /*can't use result because update return a number of affected rows(first parameter of result array)
    I should call findbypk to get return result
    */
   //this have time
    models.Post.update(updatedPost,{where:{id:id,userId:userId}}).then(()=>{
        return models.Post.findByPk(id)
    }
    ).then((result)=>{
        res.status(200).json({
            message:"update successfully",
            post:result})
    }).catch(error =>{
        res.status(500).json({
            message:"Something went wrong!"
        })
    })


}

//delete but would delelte same again
function destroy(req,res){
    const id =req.params.id;
    const userId =1;
    
    models.Post.destroy({where:{id:id,userId:userId}}).then(result =>{
        res.status(200).json({
            message:"delete successfully",
            })
    }).catch(error =>{
        res.status(500).json({
            message:"Something went wrong!",
        })
    })
}

module.exports={
    save:save,
    show:show,
    index:index,
    update:update,
    destroy:destroy

}