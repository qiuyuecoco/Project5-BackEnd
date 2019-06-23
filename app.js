const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './views/layout'));
app.set('view engine', 'pug');

mongoose.connect('mongodb://127.0.0.1/MongoDB', {useNewUrlParser: true}); // "MongoDB" is the db name
// MongoDB Atlas; cloud service for database
// mongoose.connect('mongodb+srv://dbUser:Kilo3ch0@cluster0-nyrlb.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true}); // "test" is the db name
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
                partial: ` number of users`,
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
// updates/Edits User
app.post('/editUser', (req, res) => {
    let duid = req.body.user_id;
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    user.findByIdAndUpdate({uid: duid}, {
        $set:{firstName: req.body.firstName},
        $set:{lastName: req.body.lastName},
        $set:{email: req.body.email},
        $set:{password: req.body.password},
        $set:{role: req.body.role},
        $set:{age: req.body.age}}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `updated user: ${data._id} User: ${data.firstName} ${data.lastName}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
    // const newUser = new user();
    // newUser.name = req.body.name;
    // newUser.role = req.body.role;
    // newUser.save((err, data) => {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     console.log(`new user save: ${data}`);
    //     res.send(`done ${data}`);
    // });
});
//TODO: updates UserRole...applies to 1st found user
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
// TODO: delete
app.post('/removeUser', (req, res) =>{
    console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    user.findOneAndDelete({name: matchedName}, (err, data) =>{
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name: ${matchedName}, removed dat: ${data}`;
        console.log(returnMsg);
        res.send(returnMsg);
        res.redirect('/users');
    });
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listening on port: ${port}`);
});

// app.get('/', (req, res) =>{
//     res.sendFile(__dirname + '/public/index.html');
// });
//

