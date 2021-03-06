require("dotenv").config();

// require variables
let request = require('request');
let rp = require('request-promise');
let fs = require("fs-extra");
let keys = require("./keys");
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let moment = require('moment');

// variables for API keys
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

// user input variables
let inputString = process.argv;
let command = inputString[2];
let trackName = inputString.slice(3).join(" ");
let movieName = inputString.slice(3).join(" ");

// function to display my last 20 tweets
function myTweets() {
    // Twitter parameters
    let params = { screen_name: 'basementavatars', count: 20, tweet_mode: 'extended' };
    client
        .get('statuses/user_timeline/', params)
        .then(tweets => {
            let counter = tweets.length; // variable to display tweet number in reverse order
            console.log("\nThe last " + counter + " tweets from " + tweets[0].user.name + " in ascending order:\n" + "-".repeat(60));

            // print out each tweet's headline, content, and date/time of creation
            tweets.forEach(function (tweet) {
                console.log("\nTweet #" + counter + "\n" + "-".repeat(10));
                console.log(tweet.full_text.replace(/&amp;/g, '&') + "\n");
                console.log(moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').format('MMMM Do YYYY, h:mm:ss A', moment.ISO_8601) + "\n");

                // decrement the counter to match the tweet headline number
                counter--;
            });
        })
        .catch(err => console.log(err))
}

// function to display song information for Spotify search
function spotifyThis() {

    // if no song is selected in command line, show info for default song
    if (!trackName) {
        trackName = "ace of base the sign";
    }
    spotify
        .search({ type: 'track', query: trackName, limit: 1 })
        .then(response => {

            // print the song information if Spotify search yields a result
            if (JSON.stringify(response.tracks.items[0]) != undefined) {
                let trackObj = response.tracks.items[0];
                console.log("\nSpotify Song Information:\n" + "-".repeat(25) + "\n");
                console.log("Artist(s):\n" + "-".repeat(10));
                trackObj.artists.forEach(function (artist) {
                    console.log(artist.name);
                });
                console.log("\nSong Title:\n" + "-".repeat(11) + "\n" + trackObj.name);

                // error checking in case no preview link is returned
                if (trackObj.preview_url !== null) {
                    console.log("\nPreview Link:\n" + "-".repeat(13) + "\n" + trackObj.preview_url);
                } else {
                    console.log("\nPreview Link:\n" + "-".repeat(13) + "\nNo preview available for this song");
                }
                console.log("\nAlbum Title:\n" + "-".repeat(12) + "\n" + trackObj.album.name);
            } else {

                // have user search again if search doesn't yield result
                console.log("No song found. Try searching again.");
            }
        })
        .catch(err => console.log(err))
}

// function to display OMDB information for movie search
function movieThis() {

    // if no movie is selected in command line, show info for default movie
    if (!movieName) {
        movieName = "mr nobody";
    }

    // declare url for api request
    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    rp(queryUrl)
        .then(response => {
            let movieObj = JSON.parse(response);

            // print the movie information if OMDB search yields a result
            if (movieObj.Error === undefined) {
                console.log("\nHere's a summary of the movie you searched for:\n" + "-".repeat(47));
                console.log("\nTitle:\n" + "-".repeat(6) + "\n" + movieObj.Title);
                console.log("\nRelease Year:\n" + "-".repeat(13) + "\n" + movieObj.Year);

                // error checking in case IMDB or Rotten Tomatoes don't have ratings
                if (movieObj.Ratings[0]) {
                    console.log("\n" + movieObj.Ratings[0].Source + " Rating:\n" + "-".repeat(31) + "\n" + movieObj.Ratings[0].Value);
                } else {
                    console.log("\nInternet Movie Database Rating:\n" + "-".repeat(23) + "\nThe selection you entered does not have a rating on IMDB");
                }
                if (movieObj.Ratings[1]) {
                    console.log("\n" + movieObj.Ratings[1].Source + " Rating:\n" + "-".repeat(23) + "\n" + movieObj.Ratings[1].Value);
                } else {
                    console.log("\nRotten Tomatoes Rating:\n" + "-".repeat(23) + "\nThe selection you entered does not have a rating on Rotten Tomatoes");
                }
                console.log("\nCountry of Origin:\n" + "-".repeat(18) + "\n" + movieObj.Country);
                console.log("\nLanguage:\n" + "-".repeat(9) + "\n" + movieObj.Language);
                console.log("\nPlot Summary:\n" + "-".repeat(13) + "\n" + movieObj.Plot);
                console.log("\nStarring:\n" + "-".repeat(9) + "\n" + movieObj.Actors);
            } else {

                // have user search again if search doesn't yield result
                console.log("No movie found. Try searching again.");
            }
        })
        .catch(err => console.log(err))
}

// function to run one of the 3 other functions depending on what is in the random text file
function random() {
    fs.readFile('random.txt', 'utf8')
        .then(data => {

            // remove comma between command and search term (if present) from the text file and return them in an array
            let randomTask = data.split(",");

            // switch to handle the various functions
            switch (randomTask[0]) {
                case "my-tweets":
                    myTweets();
                    break;
                case "spotify-this-song":
                    trackName = randomTask[1];
                    spotifyThis();
                    break;
                case "movie-this":
                    movieName = randomTask[1];
                    movieThis();
                    break;
            }
        })
        .catch(err => console.error(err))
}

// function to log each user command with a timestamp to a text file
function log() {
    return fs.appendFile('log.txt', moment().format('MMMM Do YYYY, h:mm:ss A') + "\n" + inputString.slice(2).join(" ") + "\n\n");
}

// switch to handle various user commands and log the commands to a text file
switch (command) {
    case "my-tweets":
        myTweets();
        log();
        break;

    case "spotify-this-song":
        spotifyThis();
        log();
        break;

    case "movie-this":
        movieThis();
        log();
        break;

    case "do-what-it-says":
        random();
        log();
        break;
}