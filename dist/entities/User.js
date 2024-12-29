"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tweets_1 = require("../database/tweets");
const likes_1 = require("../database/likes");
const users_1 = require("../database/users");
const Identifier_1 = require("./Identifier");
class User extends Identifier_1.ID {
    constructor(_name, _email, _username, _password) {
        super();
        this._name = _name;
        this._email = _email;
        this._username = _username;
        this._password = _password;
        this._following = [];
        this._following = [];
    }
    get password() {
        return this._password;
    }
    get username() {
        return this._username;
    }
    get email() {
        return this._email;
    }
    get following() {
        return this._following;
    }
    sendTweet(tweet) {
        if (this.id !== tweet.user.id) {
            console.log('You can not send a tweet from another user!\n');
        }
        else {
            tweets_1.tweets.push(tweet);
            console.log(`Tweet successfully sent by @${this.username}!\n`);
        }
    }
    follow(user) {
        if (this.id === user.id) {
            console.log(`You can not follow yourself!\n`);
            return;
        }
        const filter = users_1.users.some(u => this.username === user.username);
        if (filter) {
            console.log(`User not found!\n`);
        }
        else {
            this._following.push(user);
            console.log(`${this.username} is following ${user.username}\n`);
        }
    }
    showFollowing() {
        if (this.following.length === 0) {
            console.log(`@${this.username} is not following anyone yet.`);
        }
        else {
            console.log(`@${this.username} is following:`);
            this.following.forEach(user => {
                console.log(`- @${user.username}`);
            });
        }
    }
    showTweets() {
        console.log(`\nTweets from @${this._username}:\n`);
        const userTweets = tweets_1.tweets.filter((tweet) => tweet.user.id === this.id);
        userTweets.forEach((tweet) => {
            console.log(`@${tweet.user.username}: ${tweet.content}`);
            const tweetLikes = likes_1.likes.filter((like) => like.tweet.id === tweet.id);
            if (tweetLikes.length === 1) {
                console.log(`[@${tweetLikes[0].user.username} liked this]`);
            }
            else if (tweetLikes.length === 2) {
                console.log(`[@${tweetLikes[0].user.username} and 1 other user liked this]`);
            }
            else if (tweetLikes.length > 2) {
                console.log(`[@${tweetLikes[0].user.username} and other ${tweetLikes.length - 1} users liked this]`);
            }
            tweet.showReplies();
            console.log('-----------------------------------');
        });
    }
    showFeed() {
        console.log(`\nFeed of @${this._username}\n`);
        const feed = tweets_1.tweets.filter((tweet) => this.id === tweet.user.id ||
            this._following.some((following) => following.id === tweet.user.id));
        if (feed.length > 0) {
            feed.forEach((tweet) => {
                const tweetLikes = likes_1.likes.filter((like) => like.tweet.id === tweet.id);
                console.log(`@${tweet.user.username}: ${tweet.content}`);
                if (tweetLikes.length === 1) {
                    console.log(`[@${tweetLikes[0].user.username} liked this]`);
                }
                else if (tweetLikes.length === 2) {
                    console.log(`[@${tweetLikes[0].user.username} and 1 other user liked this]`);
                }
                else if (tweetLikes.length > 2) {
                    console.log(`[@${tweetLikes[0].user.username} and other ${tweetLikes.length - 1} users liked this]`);
                }
                tweet.showReplies();
                console.log('-----------------------------------');
            });
        }
        else {
            console.log('Your feed is empty.');
        }
    }
    static createUser(user) {
        // Verifica se o username ou ID já existem
        const idExists = users_1.users.some((existingUser) => existingUser.id === user.id);
        const usernameExists = users_1.users.some((existingUser) => existingUser.username === user.username);
        if (idExists || usernameExists) {
            console.log(`It was not possible to add this user. ID or Username already taken.\n`);
            return false;
        }
        users_1.users.push(user);
        console.log(`User '@${user.username}' successfully signed up!\n`);
        return true;
    }
    toJson() {
        return {
            id: this.id,
            name: this._name,
            email: this._email,
            username: this._username,
            following: this._following.map((user) => user.username)
        };
    }
}
exports.User = User;
