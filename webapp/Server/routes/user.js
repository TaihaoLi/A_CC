const express =require ('express');
const userController= require ('../controllers/user.controller');
const checkAuthMiddleware =require('../middleware/check-auth');


const router =express.Router();
router.post('/',userController.signUp);
router.post('/logIn',userController.logIn);
router.get('/self',checkAuthMiddleware.checkAuth,userController.show);
router.patch('/self',checkAuthMiddleware.checkAuth,userController.update);
router.put('/self',checkAuthMiddleware.checkAuth,userController.update);
router.get('/verify',userController.verify);
router.get('/ssl',userController.rawQuery);

/* const todos=[{id:1,name:"name",completed:false}];

router.get('/',function(req,res,next){
    res.json(todos);
}); */

module.exports =router;
