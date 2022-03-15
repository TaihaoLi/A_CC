const express=require('express');
const imageController=require('../controllers/image.controller');
const imageUploader=require('../helpers/image-uploader');
const checkAuth=require('../middleware/check-auth');

const router=express.Router();


router.post('/self/pic',checkAuth.checkAuth,imageController.uploadImage);
router.delete('/self/pic',checkAuth.checkAuth,imageController.deleteImage);
router.get('/self/pic',checkAuth.checkAuth,imageController.getImage);
//test
router.post('/self/pic/test',imageController.upload);

module.exports=router;