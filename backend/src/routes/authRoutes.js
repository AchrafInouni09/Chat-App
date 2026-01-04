const express = require('express');
const router = express.Router();
// const user = require ('../models/users');


const {auth_mw_login, auth_mw_register} = require ('../middlewares/auth_middlware'); 


router.post ('/login', auth_mw_login, (req, res, next) => {
    // res.json ({message: 'login succuss'});
});

router.post ('/register', auth_mw_register, (req, res, next) => {
    res.json ({message : 'registerd success'});
})

// router.post ('/register', auth_middleware);


module.exports = router;
