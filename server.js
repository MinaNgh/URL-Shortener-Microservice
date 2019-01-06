const express = require('express');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const mongoose = require('mongoose');
var shortId = require("shortid");
//connection string stored in heroku config values
const urlDB = process.env.DB_URL;
// const urlDB = 'mongodb//mina:mina123456@ds139655.mlab.com:39655/fccmongo';
// require('dotenv').config();
var output;
app.use(express.static(__dirname+"/public"));
app.get("/",(req, res)=>{
	res.sendFile(__dirname+"/view/index.html");
});
app.use('/',bodyParser.urlencoded({extended:false}));
mongoose.connect('mongodb://mina:mina123456@ds139655.mlab.com:39655/fccmongo',{ useNewUrlParser: true });
var Schema = mongoose.Schema;
var URLSchema = new Schema({
	oringinal_url:{
		type: String,
		required:true
	},
	short_url:{
		type: String,
		default: shortId.generate
	} 
});
var URL = mongoose.model('URL',URLSchema);
// var findURL = function(url, done){
	
// }
app.post("/api/shorturl/new",(req,res)=>{
	input = req.body.url;
  	let originalUrl;
  	let shortUrl;
    if (validUrl.isUri(input)){
    	
    	// findURL(input,done);

    	URL.find({oringinal_url:input},(err,data)=>{

    		if(err){
    			
    			output = {
				    error: err
				 };
				
    		}
    		else{
  
    			if(data.length<1 ){
    				var newUrl = new URL({
    					oringinal_url: input,
	    			})
	    			newUrl.save((err,result) =>{
	    				if(err){
	    					console.log(err);
	    				}else {
	    					console.log(result);
	    					
				    		originalUrl = result.oringinal_url;
				    		shortUrl = "https://"+req.headers["host"]+"/api/shorturl/"+result.short_url;
				    		
	    				}
	    			})

    			}else {
    				originalUrl = data[0]['oringinal_url'];
		    		shortUrl = "https://"+req.headers["host"]+"/api/shorturl/"+data[0]['short_url'];
		    		
    			}
    			
    			output = {
				    original_url:originalUrl,
				    short_url:shortUrl
				 };
				 // console.log(server.address());
    			res.send(output);
    		}
    	});
    	
        
    }else {
        output = {
			"error":"invalid URL"
		}
		res.send(output);
    }
	
		
})
app.use("/api/shorturl/:shortUrl",(req,res)=>{

	URL.find({short_url:req.params.shortUrl},(err,data)=>{
		if(err){
			res.json({error: err});
		}else{
			res.redirect(data[0].oringinal_url);
		}
	});
});

app.listen(process.env.PORT || 8080 );