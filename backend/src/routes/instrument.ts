import express, {Request,Response,NextFunction} from 'express';
import multer from 'multer';
import { Instrument } from '../models/Instrument';
import { InstrumentWithErrorMessage } from '../models/InstrumentWithErrorMessage';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/images');
    },
    
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req: any,file: any,cb: any) => {
    if(file.mimetype === "image/jpg"  || 
       file.mimetype ==="image/jpeg"  || 
       file.mimetype ===  "image/png"){
     
    cb(null, true);
   }else{
      cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
    }
}
const upload = multer({storage: storage, fileFilter : fileFilter});

const instrumentRouter = express.Router();


// add user
instrumentRouter.route('/add').post(upload.single('image'),async(req: Request,
    res:Response, next :NextFunction) => {
    const type = req.body.type;
    const instrumentModel = req.body.instrumentModel;
    const color = req.body.color;
    const year = req.body.year;
    const hasCase = req.body.hasCase === 'true';
    const serialNum = req.body.serialNum;
    const user = req.body.user;
    const image = req.file
    const newInstrument = new Instrument({type, instrumentModel, color, year, hasCase, serialNum, user, image}); 
    
    Instrument.count({serialNum: serialNum}, async (err, count) => { 
        if(err){
            console.log("ERROR: " + err);
            return res.json(new InstrumentWithErrorMessage(null, "something went wrong"));
        }
        if(count>0){
            console.log("instrument exists!");
            return res.json(new InstrumentWithErrorMessage(null, "This instrument is already registered with the shop"));
        }
        newInstrument.save()
        .then(() => {
            console.log("return instrument");
        })
        .catch(err => {
            console.log('ERROR: ' + err);
            return res.json(new InstrumentWithErrorMessage(null, "something went wrong"));
        });
        return res.json(new InstrumentWithErrorMessage(newInstrument, ""));
    });
});

// get instrument by email
instrumentRouter.route('/get/:email').get((req, res) => {
    console.log("getting instrument by email");
    Instrument.find({user: req.params.email})
    .then(instrument => res.json(instrument))
    .catch(err => res.status(400).json('ERROR: ' + err));
});

// delete instrument by serialNum
instrumentRouter.route('/delete/:serialNum').delete((req, res) => {
    console.log("deleting")
    Instrument.findOneAndDelete({serialNum: req.params.serialNum})
    .then(() => res.json('Instrument deleted.'))
    .catch(err => res.status(400).json('ERROR: ' + err));
});

export {instrumentRouter};