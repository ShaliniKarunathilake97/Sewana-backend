const user = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports.userGuard =(req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,config.secret,async function(err,decodedtoken){
            if(err){
                return res.status(403).send({success:false,msg:'invalid token'});
            }
            else{
                req.userGuard = await user.findById(decodedtoken._id);
                next();
            }
        });
    }
    else{
        return res.status(400).send({success:false,msg:'No headers'})
    }
} 