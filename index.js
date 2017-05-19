var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
//Twitter library
var Twitter = require("twitter");
//secret app keys
var secret = require("./secret.js");
//put twitter lib and keys together
var client = new Twitter(secret);
//bring in markov generator
var markov = require("./markov.js");

var usernameObj = require("./usernameObj.js");

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	console.log(req.url);
	next();
});

// get request for two usernames
app.get("/api/tweets/:user/:user2", function(req, res){
	var username1 = req.params.user;
	var username2 = req.params.user2;
	if(!username1 && !username2){
		res.send("please input at least one username");
		return;
	}

	var params1 = usernameObj.createParams(username1);

	var params2 = usernameObj.createParams(username2);

	client.get('statuses/user_timeline', params1, function(error, tweets, response) {
		if (!error) {
			tweets = (tweets.map(function(tweet){
				return tweet.text;
			}));
			for(var i = 0; i < tweets.length; i++){
				markov.train(tweets[i]);
			}
		}
		client.get('statuses/user_timeline', params2, function(error, tweets, response){
			if (!error) {
				tweets = (tweets.map(function(tweet){
					return tweet.text;
				}));
				for(var i = 0; i < tweets.length; i++){
					markov.train(tweets[i]);
				}
				res.send(markov.generate(140));
				markov.clearChain();
			}
			else{
				console.log(error);
				res.send("oops there was an error");
			}
		});
		
	});

});

app.get("/api/tweets/:user", function(req, res){
	var username = req.params.user;
	if(!username){
		res.send("oh no, there was no username");
		return;
	}

	var params = usernameObj.createParams(username);

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			tweets = (tweets.map(function(tweet){
				return tweet.text;
			}));
			for(var i = 0; i < tweets.length; i++){
				markov.train(tweets[i]);
			}
			res.send(markov.generate(140));
			markov.clearChain();
		}
		else{
			console.log(error);
			res.send("oops there was an error");
		}
	});
});


app.use(express.static("public"));

app.use(function(req, res, next){
	res.status(400);
	res.send("400 File Not Found");
});

app.use(function(err, req, res, next){
	console.log(err);
	res.status(500);
	res.send("500 Internal Server Error");
});

app.listen(8080, function(){
	console.log("Server started: http://localhost:8080");
});