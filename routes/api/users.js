const express = require("express");
const User = require('../../models/User');
const router = express.Router();

router.get("/test",(req,res) => res.json({
    msg:"users api works"
})
);


//@route POST (submitting data) api/users/register
//@desc Register User
//@access public route
//findone checking user already exsists
router.post('/register',(req,res) => {
User.findOne({email: req.body.email})
.then(user => {
    if (user) {
        return res.status(400).json({
            email: "Email already exsists"
        });
    } else {
        const newUser = new User({
            name: req.body.name,
            email:req.body.email,
            password:req.body.password
        });
        newUser.save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    }
})
.catch(err => console.log(err));
});

module.exports = router;