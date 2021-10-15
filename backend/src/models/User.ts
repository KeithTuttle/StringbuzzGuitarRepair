import { model, Schema, Document } from 'mongoose';

interface Pin{
    name: string;
    lat: number;
    long:number;
    description: string;
}

interface IUser extends Document {
    username: string;
    password: string;
    pins: Array<Pin>;
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

const User = model<IUser>('User', userSchema);

export {User, IUser};