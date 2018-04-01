require("dotenv").config();
let fs = require("fs-extra");
let keys = require("./keys");
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let moment = require('moment');

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let params = { screen_name: 'basementavatars', count: 20, tweet_mode: 'extended' };


let inputString = process.argv;
let operand = inputString[2];

// if (operand === "my-tweets") {
//     client.get('statuses/user_timeline/', params, function (error,
//         tweets, response) {
//         if (!error) {
//             let counter = tweets.length;
//             console.log("The last " + counter + " tweets from " + tweets[0].user.name + " in ascending order:\n" + "-".repeat(60));
//             tweets.forEach(function (tweet) {
//                 console.log("\nTweet #" + counter + "\n" + "-".repeat(10));
//                 console.log(tweet.full_text.replace(/&amp;/g, '&') + "\n");
//                 console.log(moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').format('MMMM Do YYYY, h:mm:ss a', moment.ISO_8601) + "\n");
//                 counter--;
//             });
//         }
//     });
// }

switch (operand) {
    case "my-tweets":
        client.get('statuses/user_timeline/', params)
            .then(function (tweets) {
                let counter = tweets.length;
                console.log("The last " + counter + " tweets from " + tweets[0].user.name + " in ascending order:\n" + "-".repeat(60));
                tweets.forEach(function (tweet) {
                    console.log("\nTweet #" + counter + "\n" + "-".repeat(10));
                    console.log(tweet.full_text.replace(/&amp;/g, '&') + "\n");
                    console.log(moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').format('MMMM Do YYYY, h:mm:ss A', moment.ISO_8601) + "\n");
                    counter--;
                });
            })
            .catch(function (error) {
                throw error;
            })
        break;
    case "spotify-this-song":
}

