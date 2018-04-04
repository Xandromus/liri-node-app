# LIRI

LIRI (Language Interpretation and Recognition Interface) is a command line node app that takes user commands and parameters and gives back data.


## Description

LIRI can take one of four user commands:

1. my-tweets

    - This command displays the 20 most recent tweets and the time when they were created from the selected Twitter user's timeline. This information can be adjusted by adding a .env file with a Twitter key and secret and changing the screen name parameter. The Tweets are displayed in ascending order from 1 to 20. The timestamp is formatted through the moment-js library.

2. spotify-this-song *(song search term)*

    - This command uses Spotify's API to allow the user to search for a song. It then displays the song title, artist(s), a preview link (if available), and the album title. If the user leaves the song input blank, the command will default to the song "The Sign" by Ace of Base.

3. movie-this *(movie search term)*

    - This command uses the Request package and the OMDB API to allow the user to search for a movie. It then displays the movie's title, year of release, IMDB and Rotten Tomatoes ratings (if available), country of origin, language, plot summary, and actors. If the user leaves the movie input blank, the command will default to the movie "Mr. Nobody".

4. do-what-it-says

    - This command reads data from a text file (random.txt), which contains one of the three previous command lines as well as a search term if the command can take one. It uses this information to then run the command. The data in the text file can be adjusted to run any of the commands as long as it includes a comma separator and no whitespace when a search term is provided:

        `command,"(search term)"`

Finally, each user command is logged to a text file (log.txt) with a timestamp formatted by the moment-js library.


## Node Packages Used

- request
- request-promise
- fs-extra
- twitter
- node-spotify-api
- moment
- dotenv


## Authors

- **Xander Rapstine** - [Xander Rapstine](https://github.com/Xandromus)