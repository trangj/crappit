# Crappit

A clone of Reddit developed using Node.js, React, PostgreSQL, and Typescript. Users are able to sign up, login and create posts/topics and comment on others. Posts and comments, like in Reddit fashion, can be upvoted or downvoted. In addition, a plethora of moderation tools have been added, allowing to secure your communities or spice up topics with custom banners/icons! Read more below to see the full feature set!

You can play around with a live build of this app [here](https://www.crappit.lol/)

## Screenshot
![light theme](https://i.imgur.com/E6L34Ij.png)
![dark theme](https://i.imgur.com/dUlCwMn.png)

*not up to date, take a look at the live build for the full experience*

## Current Features

Crappit currently has these features:

- sign up using email or Google OAuth
- create your topic, create posts for your topic, create comments for your post, and create comment threads on your or others posts
- spice up your posts with media like photos or gifs, or attach links, or use the rich text editor to write an engaging post
- upvote or downvote others (or your) posts and comments
- add topics to your favourites, such that they can be accessed easily from the navbar
- moderate your posts or topic or you can add your friends to moderate!
- assign permissions to your moderators, restrict them to only managing posts and comments or customizing your topic or give them access to everything!
- customize your topic with banners, an icon, a neat description, or add rules
- search the entire crappit database for that post you were looking for
- recieve notifications when someone replies to your post or comments - you can disable notifications in your settings if you want!
- save your retinas with dark mode!

## Installation

Want to run Crappit? Follow these steps:

1. Open up your terminal and install node.js. You can download it [here](https://nodejs.org/en/download/).
2. Ensure that you have a postgreSQL and a redis server setup for your respective system!
3. In your terminal, cd into a directory you want to clone Crappit.
4. Follow the commands below:

```
git clone https://github.com/trangj/Crappit.git
cd Crappit/server
npm i
cd ../client
npm i
```

5. You will need to set up your process variables in order for the app to function, ensure that you have the following variables setup in .env file in the server directory:

```
  DOMAIN: 'localhost'
  DATABASE_URL: "<your postgres database url>"
  SESSION_SECRET: "<your access token secret>"
  AWS_ACCESS_KEY_ID: "<your aws access id>"
  AWS_SECRET_ACCESS_KEY: "<your aws access key>"
  GOOGLE_CLIENT_ID: "<your google id>"
  GOOGLE_CLIENT_SECRET: "<your google secret>"
  SENDGRID_KEY: "<your sendgrid api key>"
  CLIENT_URL: "http://localhost:3000"
  SERVER_URL: "http://localhost:5000"
  REDIS_URL: "<your redis database url>"
```

6. To run the server, enter the command:

```
npm run dev
```

7. Have fun!
