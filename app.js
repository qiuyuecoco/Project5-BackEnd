'use strict';

// Constants
const HOST = '0.0.0.0';

const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 4040;

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './views/layout'));
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/MongoDB', {useNewUrlParser: true}); // "MongoDB" is the db name
// MongoDB Atlas; cloud service for database
// mongodb+srv://dbUser:<password>@cluster0-nyrlb.mongodb.net/test?retryWrites=true&w=majority
// mongoose.connect('mongodb+srv://dbUser:Kilo3ch0@cluster0-nyrlb.mongodb.net/usersData?retryWrites=true&w=majority', {useNewUrlParser: true}); // "test" is the db name
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    age: { type: Number, min: 18, max: 80 },
    createdDate: { type: Date, default: Date.now }
});
const user = mongoose.model('users', userSchema);
// login page; validation doesn't exist, click button to view user list
app.get('/', function (req, res){
    res.render('login',
        {title: 'Login',
            message: 'User Management Login',
            partial: ` number of users`,
            date: moment().format('LLL')
        });
});
// create & save new user w/ redirect to user list page
app.post('/createUser', function (req, res) {
        console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
        const newUser = new user();
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.role = req.body.role;
        newUser.age = req.body.age;
        newUser.save ((err,data) =>{
            if (err) {
                return console.error(err);
            }
            console.log(`new user saved: ${data}`);
            return res.redirect('/users');
        });
});
// gets User List page
app.get('/users', function (req, res){
    user.find({}, (err, docs)=> {
        res.render('usersList',
            {
                title: 'List',
                message: `User Management List`,
                users: docs,
                date: moment().format("MM/DD/YYYY")
            });
    });
});
// gets Create User page
app.get('/newUser', (req, res) =>{
    res.render('createUser',
        {title: 'Create User',
            message: 'Create a new user with the form below!',
            date: moment().format('LLL')
        });
});
//gets Edit User page
app.get('/users/:_id', (req, res) =>{
    let userId = req.params._id;
    console.log(`GET /user/:_id: ${JSON.stringify(req.params)}`);

    user.findOne({_id: userId}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `userID: ${userId} role: ${data.role}`;
        console.log(returnMsg);
        res.render('editUser',
            {title: 'Edit User',
                user: data,
                message: 'Update the below user & submit changes',
                user_id: data._id
            });
    });
});
// updates user via form with pre-populated info
app.post('/updateUser', (req, res) =>{
    // console.log(`POST /updateUser: ${JSON.stringify(req.body)}`);
    let id= req.body._id;
    let newFirstName =req.body.firstName;
    let newLastName = req.body.lastName;
    let newEmail =req.body.email;
    let newPassword =req.body.password;
    let newRole =req.body.role;
    let newAge =req.body.age;
    user.findOneAndUpdate( {_id: id},
        {firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            password: newPassword,
            role: newRole,
            age: newAge
        }, {new: true}, (err, data) =>{
        if (err) {
            return console.log(`Oops! ${err}`);
        }
        console.log(`data == ${data.role}`);
        let returnMsg = `user name: ${newLastName} New role: ${data.role}`;
        console.log(returnMsg);
        return res.redirect('/users');
    });
});
// get Remove User page
app.get('/removeUser/:_id', (req, res) =>{
    let userId = req.params._id;
    console.log(`GET /user/:_id: ${JSON.stringify(req.params)}`);

    user.findOne({_id: userId}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `userID: ${userId} role: ${data.role}`;
        console.log(returnMsg);
        res.render('removeUser',
            {title: 'Confirm Delete',
                user: data,
                message: 'Clicking Submit will permanently delete user!',
                user_id: data._id
            });
    });
});
// delete user from the delete form
app.post('/deleted/:_id', (req, res) =>{
    let id= req.body._id;
    console.log(`GET /user/:_id: ${JSON.stringify(req.params)}`);

    user.deleteOne({_id: id}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `userID: ${id} deleted`;
        console.log(returnMsg);
        return res.redirect('/users');
    });
});

// Sort last name; ascending
app.get('/lastNameAscending', function (req, res){
    user.find({}, null, {sort:{ lastName: 1 }},(err, docs)=>{
        res.render('lastNameAscending',
                {
                    title: 'Last Name Sort Ascending',
                    message: `List sort by last name alphabetically in ascending order`,
                    users: docs,
                });
    });
});
// Sort last name; descending
app.get('/lastNameDescending', function (req, res){
    user.find({}, null, {sort:{ lastName: -1 }},(err, docs)=>{
        res.render('lastNameAscending',
            {
                title: 'Last Name Sort Descending',
                message: `List sort by last name alphabetically in descending order`,
                users: docs,
            });
    });
});
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Express server listening on http://:${HOST}:${port}`);
});
