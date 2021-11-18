import { model, Schema, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
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
}, {
    timestamps: true,
});

const User = model<IUser>('User', userSchema);

export {User, IUser};