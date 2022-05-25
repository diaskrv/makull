const mongoose = require('mongoose')
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const hbs = require('hbs')
const exphbs = require("express-handlebars")
const mongo = require("mongodb").MongoClient
const cookieParser = require('cookie-parser')
const session = require('express-session')
const {check} = require('express-validator')
const UsersSchema = require('./Users')
const ModSchema = require('./Moderators')

mongoose.connect('mongodb+srv://diaskrv:123456ddd@cluster0.ym1ax.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error',()=>console.log("Error to connection"))
db.once('open',()=>console.log("Connected to Database"))

const app = express()
url='mongodb://localhost:27017/userDataBase'
const staticPath = path.join(__dirname, "/")
const port = process.env.PORT || 7000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(staticPath))
app.set("view engine", "hbs")
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())
hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
})

app.get("/", (req, res) => {
    res.render("../index")
})
app.get("/rega", (req, res) => {
    res.render("../rega")
})
app.post("/rega", async (req, res) => {

    let name = req.body.username
    let email = req.body.email
    let password = req.body.password

    if(await UsersSchema.findOne({email: email}).lean() !== null){return res.send("Email already taken")}
    if(await UsersSchema.findOne({username: name}).lean() !== null){return res.send("Username already taken")}
    check('name', "The name box cannot be empty").notEmpty()
    check('email', "The email box cannot be empty").notEmpty()

    //Password checking
    check('password', "The password box cannot be empty").notEmpty()
    if(password.length < 7 && password.length > 14){return res.send("Password less than 7 symbols")}
    //if(password.search(".") === -1 || password.search("_") === -1){return res.send("Password should contain special symbols contains")}
    if(password.toUpperCase() === password) {return res.send("Your password should contain small letters")}
    if(password.toLowerCase() === password){return res.send("Your password should contain capital letters")}
    //---------
        const schema = new UsersSchema({
            'username' : name,
            'email' : email,
            'password' : password
        })
        await schema.save()
        return res.redirect('../login')
})
app.get("/login", async function (req, res) {
    res.render('../login')
})
app.post("/login", async function (req, res) {
    let username = req.body.username
    let password = req.body.password
    let user = await UsersSchema.findOne({username: username, password:password}).lean()


    res.cookie("user", user)

    if(await ModSchema.findOne({username: username}).lean() !== null){
        return res.redirect('../admin')
    }
    if (user === null) {
        return res.send("Username or password is wrong")
    }
    return res.redirect('../profile')
})
app.get('/admin', async (req, res) => {
    let users = await UsersSchema.find().lean();
    res.render('../admin', {users: users})
})
app.get('/sort_by_username', async (req, res) => {
    let users = await UsersSchema.find().sort({username: 'asc'}).lean();
    res.render('../admin', {users: users})
})
app.get('/sort_by_email', async (req, res) => {
    let users = await UsersSchema.find().sort({email: 'asc'}).lean();
    res.render('../admin', {users: users})
})

app.get('/add_user', (req, res)=>{
    res.render('../add_user')
})

app.post('/add_user', async (req, res) => {
    let name = req.body.username
    let email = req.body.email
    let password = req.body.password

    if(await UsersSchema.findOne({email: email}).lean() !== null){return res.send("Email already taken")}
    if(await UsersSchema.findOne({username: name}).lean() !== null){return res.send("Username already taken")}
    check('name', "The name box cannot be empty").notEmpty()
    check('email', "The email box cannot be empty").notEmpty()

    //Password checking
    check('password', "The password box cannot be empty").notEmpty()
    if(password.length < 7 && password.length > 14){return res.send("Password less than 7 symbols")}
    //if(password.search(".") === -1 || password.search("_") === -1){return res.send("Password should contain special symbols contains")}
    if(password.toUpperCase() === password) {return res.send("Your password should contain small letters")}
    if(password.toLowerCase() === password){return res.send("Your password should contain capital letters")}
    //---------
    let data = {
        "username": name,
        "email": email,
        "password": password
    }

    await UsersSchema.create(data);

    return res.redirect('../admins');
})

app.get('/delete_user/:username', async (req, res) => {
    let username = req.params.username;
    console.log(username)
    await UsersSchema.deleteOne({username: username})
    return res.redirect('../admin')
})

app.get('/edit_user/:username', async (req, res) => {
    let username = req.params.username;
    let user = await UsersSchema.findOne({username:username}).lean()
    return res.render('../edit', {user:user})
})

app.post('/edit_user/:username', async(req, res) => {
    let username = req.params.username;

    let new_username = req.body.name;
    let new_email = req.body.email;
    let new_city = req.body.city;

    await UsersSchema.updateOne({username: username}, {username: new_username, email: new_email, city: new_city});

    return res.redirect('../admin')
})


app.get("/profile", async function (req, res) {
    let users = await UsersSchema.find().lean()
    res.render('../profile', {users : users})
})

app.listen(port, function() {
    console.log('Server is running at port #'+ port)
})
