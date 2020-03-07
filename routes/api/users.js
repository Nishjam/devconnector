const express = require("express");
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require("passport")
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const router = express.Router();

//Load Input Validation
const validateRegisterInput = require('../../validation/register');

//@route POST (submitting data) api/users/register
//@desc Register User
//@access public route
//findone checking user already exsists

router.post('/register', (req , res) => {
 
    const {errors , isValid} = validateRegisterInput(req.body);
 //Checking validation
 if(!isValid){
    return res.status(400).json(errors);
 }
 User.findOne({email: req.body.email})
  .then(user => {
    if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
    } else {
        const avatar = gravatar.url(req.body.email,{
         s:'200',
         r:'pg',
         d:'mm'
        });
        const newUser = new User({
         name: req.body.name,
         email:req.body.email,
         //avatar: avatar;
         avatar,
         password:req.body.password
        });
        bcrypt.genSalt(10,(err,salt) => {
         if(err) throw err;
            bcrypt.hash(newUser.password, salt, (err,hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser
                 .save()
                 .then(user => res.json(user))
                 .catch(err => console.log(err));
            });
        });
    }
 })
 .catch(err => console.log(err));
});

//@route POST (submitting data) api/users/login
//@desc Login User / Returning JWT Token
//@access public route

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
     //Find if user exists
     //User.findOne({email:email});
    User.findOne({email})
     .then(user => {
        if(!user){
            return res.status(404).json({email:'User not found'});
        }

        //check password
        bcrypt.compare(password,user.password)
            .then( isMatch => {
             if(isMatch) {
                //return res.json({msg:'Login Successful'});
                //create Payload
                const payload = {id: user.id, name: user.name, 
                 avatar: user.avatar};
                 //sign token
                 jwt.sign(payload,
                    keys.secretOrKey,
                    {expiresIn:3600},
                    (err, token) => {
                        return res.json({
                            token: "Bearer " + token
                        });
                    }
                );
            } else{
                return res.status(400).json({password:'Password incorrect'});
            }
            });

        })
        .catch(err =>console.log(err));
});

//@route Get api/users/current
//@desc  Current User
//@access private route

router.get("/current", 
    passport.authenticate('jwt' , {session:false}),
    (req,res) => {
        res.json ({msg : 'Success'});
    })

module.exports = router;