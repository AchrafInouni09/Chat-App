const {AddUser_mw, GetAllUsers_mw, DeleteUser_mw , UpdateUser_mw} = require ('../middlewares/Users_middleware');
const express = require ('express');

const router = express.Router ();


router.get ('/', GetAllUsers_mw);
router.post ('/', AddUser_mw);
router.put ('/:id', UpdateUser_mw);
router.delete ('/:id', DeleteUser_mw);


module.exports = router;