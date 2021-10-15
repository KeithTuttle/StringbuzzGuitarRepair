import { model, Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
}

const userSchema: Schema = new Schema({

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
}, {
    timestamps: true,
});

const User = model<IUser>('User', userSchema);

export {User, IUser};