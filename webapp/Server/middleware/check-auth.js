const jwt =require('jsonwebtoken');
const constants = require('../constants/constants');
const LOGGER=require('../logger/logger');


function checkAuth(req,res,next){
    try{
        const token =req.headers.authorization.split(" ")[1];
        const decodedToken =jwt.verify(token,"secret" );
        //add decode token data to the req
        req.userData =decodedToken;
        next();
        

    }catch(e){
        LOGGER.warn('Invalid or expired token provided!');
        return res.status(401).json({
            message:"Invalid or expired token provided!"
        })

    }
}

module.exports={
  checkAuth:checkAuth
}