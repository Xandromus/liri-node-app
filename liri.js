require("dotenv").config();
let fs = require("fs-extra");
let keys = require("./keys");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);