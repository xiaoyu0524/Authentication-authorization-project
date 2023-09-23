require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();
console.log()

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
    .then((foundUser) => {
        res.render('secrets')
    })
    .catch((err)=>{
        console.log(err);
    });
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username})
    .then((foundUser) => {
        if(foundUser) {
            if(foundUser.password === md5(password)) {
                res.render('secrets')
            } else {
                res.render("home");
            }
        } else {
            res.render("home");
        }
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.listen(3000, () => {
    console.log('Running at https://localhost:3000')
});