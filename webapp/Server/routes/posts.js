//this file is used for test code
const express =require ('express');
const postsController= require ('../controllers/post.controller');
const checkAuthMiddleware =require('../middleware/check-auth');

const router =express.Router();
router.post('/',checkAuthMiddleware.checkAuth,postsController.save);
//router.get('/',postsController.index);
router.get('/:id',postsController.show);
router.patch('/:id',checkAuthMiddleware.checkAuth,postsController.update);
router.delete('/:id',checkAuthMiddleware.checkAuth,postsController.destroy);

router.get('/',function(req,res){
    res.statusCode=200;
    res.statusMessage="OK"
    res.send();
})

module.exports = router;