const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config({path: './config/config.env'})
const cors = require("cors")
const cookieParser  = require('cookie-parser')
const router = require('../backend/router/authRoutes');
const documentRoutes = require('../backend/router/documentRoutes');
const { connectProducer } = require('./kafka/kafkaProducer');
const passportRoutes = require('./router/passportRoutes'); 


const app = express();
const port = process.env.PORT || 4000;
app.use("/api/documents" , documentRoutes);
app.use(express.json()); 
app.use(cookieParser());
app.set("trust proxy", 1);

const allowedOrigins = ["*"]
app.use(cors({
    origin:allowedOrigins,
    credentials: true}));
app.use(express.json()); 

connectProducer().catch(err => console.error("Kafka producer error:", err));

app.get("/" , (req,res)=>{
    res.send(`The code is working${port}`)
})

app.use("/api/auth" , router); 
app.use("/api/passports" , passportRoutes); 


app.listen(port , ()=>{
    console.log(`now responding to port ${port}`);
}) 
