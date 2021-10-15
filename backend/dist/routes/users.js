"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const argon2_1 = __importDefault(require("argon2"));
const UserWithErrorMesage_1 = require("../models/UserWithErrorMesage");
const nodemailer_1 = __importDefault(require("nodemailer"));
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
usersRouter.route('/').get((req, res) => {
    console.log("getting all users");
    User_1.User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('ERROR: ' + err));
});
usersRouter.route('/add').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("adding a user");
    const username = req.body.username;
    const password = yield argon2_1.default.hash(req.body.password);
    const newUser = new User_1.User({ username, password });
    User_1.User.count({ username: username }, (err, count) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log("ERROR: " + err);
            return res.json(new UserWithErrorMesage_1.UserWithErrorMessage(null, "something went wrong"));
        }
        if (count > 0) {
            console.log("user exists!");
            return res.json(new UserWithErrorMesage_1.UserWithErrorMessage(null, "That username is taken"));
        }
        console.log("saving user");
        newUser.save()
            .then(() => {
            console.log("return saved user");
            newUser.password = "";
        })
            .catch(err => {
            console.log('ERROR: ' + err);
            return res.json(new UserWithErrorMesage_1.UserWithErrorMessage(null, "something went wrong"));
        });
        return res.json(new UserWithErrorMesage_1.UserWithErrorMessage(newUser, ""));
    }));
}));
usersRouter.route('/:id').get((req, res) => {
    User_1.User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('ERROR: ' + err));
});
usersRouter.route('/username/:username').get((req, res) => {
    console.log("getting user by username");
    User_1.User.findOne({ username: req.params.username })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('ERROR: ' + err));
});
usersRouter.route('/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    User_1.User.findOne({ username: username }, function (err, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                var message = "An error occured";
                var response = new UserWithErrorMesage_1.UserWithErrorMessage(null, message);
                return res.json(response);
            }
            if (!user) {
                console.log("user not found");
                var message = "Username does not exist";
                var response = new UserWithErrorMesage_1.UserWithErrorMessage(null, message);
                return res.json(response);
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                console.log("pw not found");
                var message = "Password is incorrect";
                var response = new UserWithErrorMesage_1.UserWithErrorMessage(null, message);
                return res.json(response);
            }
            var response = new UserWithErrorMesage_1.UserWithErrorMessage(user, "");
            return res.json(response);
        });
    });
}));
usersRouter.route('/:id').delete((req, res) => {
    User_1.User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('ERROR: ' + err));
});
usersRouter.route('/update/:id').post((req, res) => {
    var options = {
        upsert: false,
        new: true
    };
    User_1.User.findByIdAndUpdate(req.params.id, req.body, options, function (err, user) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(user);
        }
    });
});
usersRouter.route('/share/username/:username').post((req, res) => {
    console.log("sharing pin");
    User_1.User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            console.log(err);
            var message = "An error occured";
            var response = new UserWithErrorMesage_1.UserWithErrorMessage(null, message);
            return res.json(response);
        }
        if (!user) {
            console.log("username doesn't exist in sharePin");
            var message = "Username does not exist";
            var response = new UserWithErrorMesage_1.UserWithErrorMessage(null, message);
            return res.json(response);
        }
        user.pins = user.pins.concat(req.body.pins);
        User_1.User.updateOne({ username: user.username }, { $set: { "pins": user.pins } }, { upsert: true, new: true }, (err) => {
            if (err) {
                console.log("error occured in sharer updateOne");
                var response = new UserWithErrorMesage_1.UserWithErrorMessage(null, err);
                return res.json(response);
            }
            else {
                console.log("SHARED");
                var response = new UserWithErrorMesage_1.UserWithErrorMessage(user, "");
                return res.json(response);
            }
        });
    });
});
usersRouter.route('/update/username/:username').post((req, res) => {
    var options = {
        upsert: false,
        new: true
    };
    User_1.User.findOneAndUpdate({ username: req.body.username }, req.body, options, function (err, user) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(user);
        }
    });
});
usersRouter.route('/update/username/:username').get((req, res) => {
    console.log("update user by username");
    User_1.User.updateOne({ username: req.params.username }, { $set: { "username": req.body.username } }, { upsert: true, new: true }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Updated User");
        }
    });
});
usersRouter.post("/contact", (req, res) => {
    console.log("sending mail");
    var transporter = nodemailer_1.default.createTransport(`smtps://mappinteam%40gmail.com:MappinProject@smtp.gmail.com`);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const name = firstName + " " + lastName;
    const email = req.body.email;
    const message = req.body.message;
    var mailOptions = {
        from: email,
        to: 'mappinteam@gmail.com',
        subject: 'Contact Us Form',
        text: "name: " + name + "\nemail: " + email + "\n\n" + message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(`error: ${error}`);
            res.json({ status: "failed" });
        }
        console.log(`Message Sent ${info.response}`);
        res.json({ status: "sent" });
    });
});
//# sourceMappingURL=users.js.map