const express = require('express');
const router = express.Router();
const upload = require ('../config/Upload');


const {auth_mw_login, auth_mw_register} = require ('../middlewares/auth_middlware'); 


router.post ('/login', auth_mw_login, (req, res, next) => {
    // res.json ({message: 'login succuss'});
});

// router.post ('/register', upload.single ('avatar')  , auth_mw_register, (req, res, next) => {
//     res.json ({message : 'registerd success'});
// })

router.post ('/register', upload.single('avatar'), (req, res, next) => {
    console.log('--- REGISTER ROUTE HIT ---');
    console.log('File received:', req.file ? req.file.filename : 'no file');
    next();
}, auth_mw_register, (req, res, next) => {
    res.json ({message : 'registerd success'});
})


module.exports = router;
