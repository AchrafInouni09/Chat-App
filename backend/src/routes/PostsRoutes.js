const express = require ('express');
const router = express.Router ();

const {auth_mw_token} = require ('../middlewares/auth_middlware');


const {get_all_posts_mw, create_post_mw, get_post_mw,
     update_post_mw, delete_post_mw, like_post_mw, unlike_post_mw,
    getcomment_post_mw, addcomment_post_mw, deletecomment_post_mw, get_my_posts_mw} = require ('../middlewares/posts_middleware');



router.get ('/', get_all_posts_mw);

router.get ('/my', auth_mw_token, get_my_posts_mw);

router.get ('/:id', auth_mw_token, get_post_mw);



router.put('/:id', auth_mw_token, update_post_mw);

router.post ('/', auth_mw_token, create_post_mw);


router.delete('/:id', auth_mw_token, delete_post_mw);


router.post('/:id/like', auth_mw_token, like_post_mw);

router.delete('/:id/like', auth_mw_token, unlike_post_mw);



router.get('/:id/comments',getcomment_post_mw );


router.post('/:id/comments', auth_mw_token, addcomment_post_mw );


router.delete('/comments/:commentId', auth_mw_token, deletecomment_post_mw);



module.exports = router;