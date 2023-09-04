const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')   //---to parse cookies we use this middleware----


const {connectMongodb} = require ("./dbConnection")
//db connection
connectMongodb("mongodb://127.0.0.1:27017").then(()=>console.log("mongodb connected"))

const app = express()
app.use(bodyParser.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(cookieParser())


//----To serve all images inside upload use following--------------------
app.use('/uploads', express.static(__dirname + '/uploads'))


//providing all the Routes to base
app.use('/api',routes)

app.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
  });