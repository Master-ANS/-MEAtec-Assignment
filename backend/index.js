const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config({path: './config/config.env'})
const cors = require("cors")
const cookieParser  = require('cookie-parser')
const router = require('../backend/router/authRoutes');


const app = express();
const port = process.env.PORT || 4000;
app.use(express.json()); 
app.use(cookieParser());
app.set("trust proxy", 1);

const allowedOrigins = ["*"]
app.use(cors({
    origin:allowedOrigins,
    credentials: true}));
app.use(express.json()); 

app.get("/" , (req,res)=>{
    res.send(`The code is working${port}`)
})

app.use("/api/auth" , router); 

app.listen(port , ()=>{
    console.log(`now responding to port ${port}`);
}) 

























































//middlewares
// const express = require("express");
// const bodyParser = require("body-parser");

// //zod library is used for input validation

// const port = 3000;
// const app = express();
// app.use(express.json()); 

// const middleware1 = (req,res,next)=>{
//     const username = req.headers.username;
//     const password = req.headers.password;
//     const n  = req.query.n;
//     if(!(username === "Ayush_navneet_singh" && password === "Qwerty2(*&^%")){
//         res.status(403).json({
//             msg : "Something is wrong with either your username or password"
//         })
//     }
//     else {
//         next();
//     }
// };

// const middleware2 = (req,res,next)=>{
//     const username = req.headers.username;
//     const password = req.headers.password;
//     const n  = req.query.n;
//     if(n != 1 && n!= 2){
//         res.status(403).json({
//             msg : "Something is wrong with your input"
//         })
//     }
//     else {
//         next();
//     }
// };

// app.get("/ayush" ,middleware1, middleware2 , (req,res)=>{
//     res.send("you have a healthy kidney");
// })

// //Global catches  - it is a middleware that is used to throw errors to the users in case of exceptions 
// app.use((err,req,res,next)=>{
//     res.json({
//         msg: "your request cant be processed due to some error" 
//     })
// })


// app.listen(port , ()=>{
//     console.log(`now responding to port ${port}`);
// }) 
