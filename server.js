const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express(); 



//Body parser middleware
app.use(bodyparser.urlencoded ({extended: false}));
app.use(bodyparser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to mongoDb 
mongoose
.connect(db)
.then(() => console.log("mongoDb Connected"))
.catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//First Route
app.get('/',(req,res)=>res.send('Hello world'));

//Use Routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port=5555;
app.listen(port,() => console.log(`Server is running on port ${port}`));