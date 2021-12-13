"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3
    },
    firstName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 2
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 2
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3
    },
    isAdmin: {
        type: Boolean,
        required: true,
        unique: false,
        default: false,
    },
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
//# sourceMappingURL=User.js.map