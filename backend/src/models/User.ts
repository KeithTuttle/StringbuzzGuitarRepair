import { model, Schema, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isAdmin: boolean;
}

const userSchema: Schema = new Schema({
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

const User = model<IUser>('User', userSchema);

export {User, IUser};