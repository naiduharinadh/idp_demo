const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");


const app = express();
app.set("view engine" , "ejs");


mongoose.connect("mongodb+srv://harinadh14:N%40dh2306@atlascluster.9fb52n9.mongodb.net/k8scluster");
//app.use(express.urlencoded({extended:"true"}));
const userschema = mongoose.Schema({
	name:String,
});

const user= mongoose.model("user" , userschema);

app.get("/",(req,resp)=>{
	resp.render("form",{msg:"this is from the k8s cluster"})
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
