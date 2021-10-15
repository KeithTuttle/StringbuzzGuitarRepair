import express from 'express';
import { QueryOptions } from 'mongoose';
import { User, IUser } from '../models/User';
import argon2 from 'argon2';
import { UserWithErrorMessage } from '../models/UserWithErrorMesage'
import nodemailer from "nodemailer";

const usersRouter = express.Router();

// get all users
usersRouter.route('/').get((req, res) => {
    console.log("getting all users");
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('ERROR: ' + err));
});


// add user
usersRouter.route('/add').post(async(req, res) => {
    console.log("adding a user");
    const username = req.body.username;
    const password = await argon2.hash(req.body.password);
    const newUser = new User({username, password});

    User.count({username: username}, async (err, count) => { 
        if(err){
            console.log("ERROR: " + err);
            return res.json(new UserWithErrorMessage(null, "something went wrong"));
        }
        if(count>0){
            console.log("user exists!");
            return res.json(new UserWithErrorMessage(null, "That username is taken"));
        }
        console.log("saving user");
        newUser.save()
        .then(() => {
            console.log("return saved user");
            newUser.password = "";
        })
        .catch(err => {
            console.log('ERROR: ' + err);
            return res.json(new UserWithErrorMessage(null, "something went wrong"));
        });
        return res.json(new UserWithErrorMessage(newUser, ""));
    }); 
});

// get user by id
usersRouter.route('/:id').get((req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('ERROR: ' + err));
});

// get user by username
usersRouter.route('/username/:username').get((req, res) => {
    console.log("getting user by username");
    User.findOne({username: req.params.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('ERROR: ' + err));
});

// get user by username and password
usersRouter.route('/login').post(async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);

    User.findOne({username: username}, async function(err: Error, user: IUser){
        if(err) {
            console.log(err);
            var message = "An error occured";
            var response = new UserWithErrorMessage(null, message);
            return res.json(response);
        }
        if(!user) {
            console.log("user not found");
            var message = "Username does not exist";
            var response = new UserWithErrorMessage(null, message);
            return res.json(response);
        }
        const valid = await argon2.verify(user.password, password);
        if(!valid){
            console.log("pw not found");
            var message = "Password is incorrect";
            var response = new UserWithErrorMessage(null, message);
            return res.json(response);
        }
        var response = new UserWithErrorMessage(user, "");
        return res.json(response);
    })
});

// delete user by id
usersRouter.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('ERROR: ' + err));
});

//update a user by id
usersRouter.route('/update/:id').post((req, res) => {
    var options: QueryOptions ={
        upsert: false,
        new: true
    };
    User.findByIdAndUpdate(req.params.id, req.body, options, function(err, user) {
        if(err){
            res.send(err)
        }
        else {
            // get back the new user
            // to get back the old record, remove the 'new' from options or set to false
            res.json(user);
        }
    }); 
});

//Share Pins
// TODO: refactor so all code paths return. left as is because I need to get the user, alter it by adding the new pins, and inserting
usersRouter.route('/share/username/:username').post((req, res) => {
    console.log("sharing pin");
    User.findOne({username: req.body.username}, function(err: Error, user: IUser){
        if(err) {
            console.log(err);
            var message = "An error occured";
            var response = new UserWithErrorMessage(null, message);
            return res.json(response);
        }
        if(!user) {
            console.log("username doesn't exist in sharePin");
            var message = "Username does not exist";
            var response = new UserWithErrorMessage(null, message);
            return res.json(response);
        }
        user.pins = user.pins.concat(req.body.pins);
        User.updateOne({username: user.username}, {$set: {"pins": user.pins}}, { upsert: true, new: true }, (err) => {
            if(err){
                console.log("error occured in sharer updateOne");
                var response = new UserWithErrorMessage(null, err);
                return res.json(response);
            } 
            else{
                console.log("SHARED")
                var response = new UserWithErrorMessage(user, "");
                return res.json(response);
            }
        });
    });
});

//update user by username
usersRouter.route('/update/username/:username').post((req, res) => {
    var options: QueryOptions ={
        upsert: false,
        new: true
    };
    User.findOneAndUpdate({username: req.body.username}, req.body, options, function(err, user) {
        if(err){
            res.send(err)
        }
        else {
            // get back the new user
            // to get back the old record, remove the 'new' from options or set to false
            res.json(user);
        }
    });
});

// GET request
usersRouter.route('/update/username/:username').get((req, res) => {
    console.log("update user by username");
    User.updateOne({username: req.params.username}, {$set: {"username": req.body.username}}, { upsert: true, new: true }, (err) => {
        if(err){
            res.send(err);
        }
        else{
            // can pass a user object next to error to recieve an object
            //nModified set to 1 means it was successful
            res.send("Updated User");
        }
    });
});

usersRouter.post("/contact", (req, res) => {
    console.log("sending mail");
    var transporter = nodemailer.createTransport( 
        `smtps://mappinteam%40gmail.com:MappinProject@smtp.gmail.com` 
    ); 

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const name = firstName +" "+lastName;
    const email = req.body.email;
    const message = req.body.message; 
   
    var mailOptions = { 
        from : email, 
        to : 'mappinteam@gmail.com', 
        subject : 'Contact Us Form', 
        text: "name: " + name + "\nemail: "+ email + "\n\n"+ message
    }; 
   
    transporter.sendMail( mailOptions, (error, info) => { 
        if (error) { 
          console.log(`error: ${error}`); 
          res.json({ status: "failed" });
        } 
        console.log(`Message Sent ${info.response}`); 
        res.json({ status: "sent" });
    });
});

export {usersRouter};