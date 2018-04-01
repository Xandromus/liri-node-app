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
let trackName = inputString.slice(3).join(" ");

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
        client
            .get('statuses/user_timeline/', params)
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
        if (!trackName) {
            trackName = "ace of base the sign";
        }
        spotify
            .search({ type: 'track', query: trackName, limit: 1 })
            .then(function (response) {
                let trackObj = JSON.parse(JSON.stringify(response.tracks.items[0], null, 2));
                console.log("Artist(s):\n" + "-".repeat(10));
                trackObj.artists.forEach(function (artist) {
                    console.log(artist.name);
                });
                console.log("\nSong Title:\n" + "-".repeat(11) + "\n" + trackObj.name);
                console.log("\nAlbum Title:\n" + "-".repeat(12) + "\n" + trackObj.album.name);
                if (trackObj.preview_url !== null) {
                    console.log("\nPreview Link:\n" + "-".repeat(13) + "\n" + trackObj.preview_url);
                } else {
                    console.log("\nPreview Link:\n" + "-".repeat(13) + "\nNo preview available for this song");
                }
            })
            .catch(function (err) {
                console.log(err);
            });
        break;
}

