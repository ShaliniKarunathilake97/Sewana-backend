var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var cloudinary = require('../config/cloudinary');
const user = require('../models/user');


var functions = {
    signup: function(req,res){
        if((!req.body.fullName) || (!req.body.emailOrTP) || (!req.body.password)){
            res.json({success:false,msg:'Enter all fields'});
        }
        else{
            var newUser = User({
                fullName: req.body.fullName,
                emailOrTP: req.body.emailOrTP,
                password: req.body.password
            });
            newUser.save(function(err,newUser){
                if(err){
                    if(err.code = 11000){
                        res.status(403).json({success: false, msg:'User already exists'})
                    }else{
                        res.status(404).json({success: false, msg:'Failed to save'})
                    }
                }else{
                    res.status(201).json({success: true, msg:'Successfully saved'})
                }
            });
        }
    },
    signin: function(req,res){
        User.findOne({
            emailOrTP:req.body.emailOrTP
        },
        function(err,user){
            if(err) throw err;
            if(!user){
                res.status(403).send({success:false,msg:'Authentication failed.User not found'});
            }
            else{
                user.comparePassword(req.body.password,function(err,isMatch){
                    if(isMatch && !err){
                        var token = jwt.sign({_id:user._id},config.secret,{expiresIn:'30d'});
                        res.status(200).send({success:true,token:token});
                    }
                    else{
                        return res.status(403).send({success:false,msg:'Authentication falied.Wrong password'});
                    }
                });
            }

        }
        );
    },
    getInfo: function(req,res){
        user.findById({_id:req.userGuard._id},function(error,user){
            if(error){
                return res.status(400).json({success:false,error:error});
            }
            else{
                return res.status(200).send({success:true,user:{
                    fullName:user.fullName,
                    emailOrTP:user.emailOrTP,
                    profileImage:user.userProfileImage,
                    public_id:user.public_id
                }})
            }
        });
    }
}


module.exports = functions;