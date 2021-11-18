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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./routes/users");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const app = express_1.default();
    const port = process.env.PORT || 5000;
    app.use(cors_1.default());
    app.use(express_1.default.json());
    const uri = process.env.ATLAS_URI + '';
    mongoose_1.default.connect(process.env.MONGODB_URI || uri, { useNewUrlParser: true, useCreateIndex: true });
    const connection = mongoose_1.default.connection;
    connection.once('open', () => {
        console.log("MongoDB database connection established!");
    });
    app.use('/users', users_1.usersRouter);
    if (process.env.NODE_ENV === 'production') {
        app.use(express_1.default.static('public'));
        app.get('*', (req, res) => {
            res.sendFile(path_1.default.join(__dirname + '/public/index.html'));
        });
    }
    else {
        app.get("/", (req, res) => {
            res.send("api started");
        });
    }
    app.listen(port, () => {
        console.log(`server started on port: ${port}`);
    });
});
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map