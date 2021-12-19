import { model, Schema, Document } from 'mongoose';

interface IInstrument extends Document {
    type: string;
    instrumentModel: string;
    color: string;
    year: string;
    hasCase: boolean;
    user: string;
    serialNum: string;
    image: any;
}

const instrumentSchema: Schema = new Schema({
    type: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        minLength: 3
    },
    instrumentModel: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        minLength: 3
    },
    color: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        minLength: 2
    },
    year: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 4
    },
    hasCase: {
        type: Boolean,
        required: false,
        unique: false
    },
    user: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3
    },
    serialNum: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3
    },
    image: {
        type: Object,
        required: false
    },
}, {
    timestamps: true,
});

const Instrument = model<IInstrument>('Instrument', instrumentSchema);

export {Instrument, IInstrument};