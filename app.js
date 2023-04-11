//jshint esversion:6
const dotenv = require('dotenv')
dotenv.config()
const express =  require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const ejs = require('ejs');
app.set('view engine','ejs');
const mongoose = require('mongoose'); 
const encrypt = require("mongoose-encryption");


app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/UserDB")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


userSchema.plugin(encrypt, { secret: process.env.SECRETKEY, encryptedFields: ['password'] });

const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home")
})

app.get("/login", function(req,res){
    res.render("login")
})

app.get("/register", function(req,res){
    res.render("register")
})


app.get("/submit", function(req,res){
    res.render("submit")
})

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("login")
        }
    });    
})

app.post("/login", function(req,res){
    var userEnterEmail = req.body.username
    var userEnterPass  = req.body.password

    User.findOne({email: userEnterEmail}, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            console.log(results)
            if(results)
            {
                if(results.password === userEnterPass){
                    res.render("secrets")
                }
                else{
                    res.send("Wrong credentials")
                }   
            }
            else
            {
                res.send("Not registered. Please register")
            }
        }
    })
})





















app.listen(3000, function(req,res){
    console.log("Server is up and running")
});