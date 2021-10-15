import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { usersRouter } from './routes/users';
import dotenv from 'dotenv';
import path from 'path';

const main = async () => {
    //env variables
    dotenv.config();

    // create express server and setup port
    const app = express();
    const port = process.env.PORT || 5000;

    //middleware and allow to parse json
    app.use(cors());
    app.use(express.json());

    const uri = process.env.ATLAS_URI+''; 
    mongoose.connect(process.env.MONGODB_URI || uri, { useNewUrlParser: true, useCreateIndex: true }
    );
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB database connection established!");
    });

    // routers
    app.use('/users', usersRouter);

    if (process.env.NODE_ENV === 'production'){
      app.use(express.static('public'));

      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      })
    } else {
      app.get("/", (req, res) => {
        res.send("api started");
      });
    }

    //starts server and listens
    app.listen(port, () => {
        console.log(`server started on port: ${port}`);
      });
    
  };
  
  main().catch((err) => {
    console.error(err);
  });
  