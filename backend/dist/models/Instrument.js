"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instrument = void 0;
const mongoose_1 = require("mongoose");
const instrumentSchema = new mongoose_1.Schema({
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
const Instrument = mongoose_1.model('Instrument', instrumentSchema);
exports.Instrument = Instrument;
//# sourceMappingURL=Instrument.js.map