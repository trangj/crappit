# Crappit
A less good version of Reddit developed using Node.js, React, and MongoDB. Users are able to sign up, login and create posts and comment on others. Posts, like in Reddit fashion, can be upvoted or downvoted.

## Current Features
Crappit currently has these features:
- sign up using email.
- create topics, create posts for each topic, create comments for each post
- upvote or downvote posts
- browse latest topics and posts within topics
- add topics to your favourites, such that they can be accessed easily from the navbar
- look for topics and posts in the search bar. 

## Developing Features
Features currently in development:
- replies to comments
- profile page
- properly obtain hot posts based on number of upvotes
- ability to sign in using OAuth2.

## Installation
Want to run Crappit? Follow these steps:
1. Open up your terminal and install node.js. You can download it [here](https://nodejs.org/en/download/).
2. In your terminal, cd into a directory you want to clone Crappit.
3. Follow the commands below:
```
git clone https://github.com/trangj/Crappit.git
cd Crappit-React
npm i
cd client
npm i
cd ..
```
4. You need to set up a file that contains, your mongodb uri, AWS id and key and a secret for jwt. To do this, create a directory named 'config' in the main directory and then create a file named keys.js inside there. The format of this file should be similar to this:
```
module.exports = {
  mongoURI:"<your mongo uri>",
  jwtSecret: "<your secret>",
  aws: {
    AWS_ACCESS_KEY_ID: "<your aws access id>",
    AWS_SECRET_ACCESS_KEY: "<your aws access key>"
  }
};

```
5. To run the server, enter the command:
```
npm run dev
```
6. Have fun!
