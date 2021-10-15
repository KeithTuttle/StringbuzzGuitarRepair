"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3
    },
    pins: {
        type: Array,
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 1
        },
        lat: {
            type: Number,
            required: true
        },
        long: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
    }
}, {
    timestamps: true,
});
const User = mongoose_1.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=User.js.map