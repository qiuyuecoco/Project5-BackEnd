const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
// const port = process.env.PORT || 27017;

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
// TODO: this may need combined with the below create; /newUser
// db.once('open', function() {
//      console.log('db connected');
//      const newUser = new user();
//      newUser.name = "Ken Adams";
//      newUser.role = "Student";
//      newUser.age = 20;
//      newUser.save((err, data) => { // stored to the database
//         if (err) {
//             return console.error(err);
//         }
//         console.log(`new user save: ${data}`);
//     });
// });

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now }
});

const user = mongoose.model('users', userSchema);
// create
app.post('/createUser', (req, res) => {
    // if(res !== ''){
        console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
        const newUser = new user();
        newUser.uid = req.body.uid;
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
            res.send(`done: ${data}`);
        });
    // } else{
    //     res.send('please make sure all fields are filled out')
    // }
});

app.get('/', function (req, res){
    res.render('login',
        {title: 'Login',
            message: 'User Management Login',
            partial: ` number of users`,
            date: moment().format('LLL')
        });

});
// list of users
app.get('/users', function (req, res){
    user.find({}, (err, docs)=> {
        res.render('usersList',
            {
                title: 'User List',
                message: 'User Management List',
                partial: ` number of users`,
                users: docs,
                date: moment().format("MM/DD/YYYY")

            });
    });
});
app.get('/newUser', (req, res) =>{
    res.render('createUser',
        {title: 'Create User',
            message: 'Create a new user with the form below!',
            date: moment().format('LLL')
        });
});
// read/ edit possibly?
app.get('/users/:name', (req, res) =>{
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.findOne({firstName: userName}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name: ${userName} role: ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});
// TODO: edit
app.post('/editUser/:uid', (req, res) => {
    let uid = req.params.uid;
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    user.findOne({firstName: uid}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name: ${uid} role: ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        res.send(`done ${data}`);
    });
});
//TODO: update
app.post('/updateUserRole', (req, res) =>{
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    let newrole = req.body.role;
    user.findOneAndUpdate({name: matchedName}, {role: newrole}, {new: true}, (err, data) =>{
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data == ${data.role}`);
        let returnMsg = `user name: ${matchedName} New role: ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
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

