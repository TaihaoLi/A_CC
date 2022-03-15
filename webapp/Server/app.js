require('dotenv/config')

const express =require('express');
const bodyParser =require('body-parser');
const cookieParser=require('cookie-parser');


const imageRoute=require('./routes/images');

const healthcheck=require('./routes/posts');

const app=express();



//const postsRoute =require('./routes/posts');
const userRoute =require('./routes/user');

app.use(bodyParser.json());
//receive binary image as req.body
app.use(bodyParser.raw({type:'image/*',limit:'10mb'}));
//url used for health check
app.use("/",healthcheck);

app.use("/v2/user",userRoute);
//app.use("/todos",userRoute);
app.use("/v2/user",imageRoute);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
/* app.use(express.static(path.join(__dirname,'public'))); */









module.exports=app;