const express  = require('express');
const userActions = require('../controller/userActions');
const router = express.Router();
const {userGuard} = require('../middleware/middleware');

//user signup

router.post('/userSignup',userActions.signup);

//user signin

router.post('/userSignin',userActions.signin);

module.exports = router;