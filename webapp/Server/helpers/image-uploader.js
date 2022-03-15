const multer=require('multer');
const path =require('path');

const storage =multer.memoryStorage({
    destination:function(req,file,cb){
        cb(null,'');
    },
    filename:function(req,file,cb){
        cb(null,new Date().getTime()+path.extname(file.originalname));
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'||file.mimetype==='image/jpg'){
        cb(null,true);
    }else{
        cd(new Error('Unsupported files'),false);
    }
}

const upload=multer({
    storage:storage,
    fileFilter:fileFilter
});

module.exports={
    upload:upload
}