const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");


const app = express();
app.set("view engine" , "ejs");

//mongodb-service is the POD service name given - to launch the shard clusters 
const uri = "mongodb://mongodb-service/k8scluster";
/*
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));
*/
mongoose.connect("mongodb+srv://harinadh14:N%40dh2306@atlascluster.9fb52n9.mongodb.net/pipeDatabase");

//this is for general use and atlas connection string.
//mongoose.connect("mongodb+srv://harinadh14:N%40dh2306@atlascluster.9fb52n9.mongodb.net/k8scluster");
//app.use(express.urlencoded({extended:"true"}));
const userschema = mongoose.Schema({
	name:String,
});

const user= mongoose.model("user" , userschema);

app.get("/",(req,resp)=>{
	resp.render("form",{msg:"this is from the k8s cluster--- modified line to detect the jenkins"})
})

app.get("/submit",(req,resp)=>{
	const u = user( {
			  name:req.query.name,
		  })
	let k = u.save();
	if(k){ resp.send("data submitted successfully ")  }
	else{
		resp.send("please reenter the data , above given is not saved yet");
	}
})

app.listen(4623, "0.0.0.0", (resp) => {console.log("server started in 4623")})
