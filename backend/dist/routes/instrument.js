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
exports.instrumentRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const Instrument_1 = require("../models/Instrument");
const InstrumentWithErrorMessage_1 = require("../models/InstrumentWithErrorMessage");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
};
const upload = multer_1.default({ storage: storage, fileFilter: fileFilter });
const instrumentRouter = express_1.default.Router();
exports.instrumentRouter = instrumentRouter;
instrumentRouter.route('/add').post(upload.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const instrumentModel = req.body.instrumentModel;
    const color = req.body.color;
    const year = req.body.year;
    const hasCase = req.body.hasCase === 'true';
    const serialNum = req.body.serialNum;
    const user = req.body.user;
    const image = req.file;
    const newInstrument = new Instrument_1.Instrument({ type, instrumentModel, color, year, hasCase, serialNum, user, image });
    Instrument_1.Instrument.count({ serialNum: serialNum }, (err, count) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log("ERROR: " + err);
            return res.json(new InstrumentWithErrorMessage_1.InstrumentWithErrorMessage(null, "something went wrong"));
        }
        if (count > 0) {
            console.log("instrument exists!");
            return res.json(new InstrumentWithErrorMessage_1.InstrumentWithErrorMessage(null, "This instrument is already registered with the shop"));
        }
        newInstrument.save()
            .then(() => {
            console.log("return instrument");
        })
            .catch(err => {
            console.log('ERROR: ' + err);
            return res.json(new InstrumentWithErrorMessage_1.InstrumentWithErrorMessage(null, "something went wrong"));
        });
        return res.json(new InstrumentWithErrorMessage_1.InstrumentWithErrorMessage(newInstrument, ""));
    }));
}));
instrumentRouter.route('/get/:email').get((req, res) => {
    console.log("getting instrument by email");
    Instrument_1.Instrument.find({ user: req.params.email })
        .then(instrument => res.json(instrument))
        .catch(err => res.status(400).json('ERROR: ' + err));
});
instrumentRouter.route('/delete/:serialNum').delete((req, res) => {
    console.log("deleting");
    Instrument_1.Instrument.findOneAndDelete({ serialNum: req.params.serialNum })
        .then(() => res.json('Instrument deleted.'))
        .catch(err => res.status(400).json('ERROR: ' + err));
});
//# sourceMappingURL=instrument.js.map