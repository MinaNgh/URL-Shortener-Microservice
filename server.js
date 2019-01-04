const express = require('express');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const mongoose = require('mongoose');
//connection string stored in heroku config values
const urlDB = process.env.DB_URL;
require('dotenv').config();

app.use(express.static(__dirname+"/public"));
app.get("/",(req, res)=>{
	res.sendFile(__dirname+"/view/index.html");
});
app.use('/',bodyParser.urlencoded({extended:false}));
app.post("/api/shorturl/new",(req,res)=>{
	input = req.body.url;
  	let output;
    if (validUrl.isUri(input)){


    	output = {
    		original_url:input,
    		short_url:""
    	};
    	// let url = input;
  //   	url = url.replace(/^https?:\/\/(www.)*/i,"");
		// output = dns.lookup(url, (err, address, family) => {
		//   console.log('address: %j family: IPv%s', address, family);
		  
		// });
        
    }else {
        output = {
			"error":"invalid URL"
		}
    }
	
	console.log(output);
	res.send(output);	
})
app.listen(process.env.PORT || 8080 );