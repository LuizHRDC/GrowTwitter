"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const types_1 = require("../types/types");
const likes_1 = require("../database/likes");
const Like_1 = require("./Like");
const users_1 = require("../database/users");
const replies_1 = require("../database/replies");
const tweets_1 = require("../database/tweets");
const Identifier_1 = require("./Identifier");
class Tweet extends Identifier_1.ID {
    constructor(_user, _content, _type, parentId = null) {
        super();
        this._user = _user;
        this._content = _content;
        this._type = _type;
        this.parentId = parentId;
    }
    get user() {
        return this._user;
    }
    get content() {
        return this._content;
    }
    get type() {
        return this._type;
    }
    reply(replyTweet) {
        replyTweet.parentId = this.id; // Vincula o reply ao tweet atual
        replies_1.replies.push(replyTweet);
    }
    like(user) {
        const userExists = users_1.users.some(u => u.id === user.id);
        if (!userExists) {
            console.log(`User not found!\n`);
            return;
        }
        const validateLike = likes_1.likes.some(like => like.user.id === user.id && like.tweet.id === this.id);
        if (validateLike) {
            console.log(`@${user.username} already liked this tweet.\n`);
            return;
        }
        const newLike = new Like_1.Like(user, this);
        likes_1.likes.push(newLike);
        if (this._type === types_1.tweetType.reply) {
            console.log(`@${user.username} liked this reply: >@${this._user.username}: ${this._content}!`);
            return;
        }
        else {
            console.log(`@${user.username} liked this tweet: >@${this._user.username}: ${this._content}!\n`);
        }
    }
    show() {
        console.log(`\n@${this._user.username}: ${this._content}`);
        if (this.type === 'reply' && this.parentId) {
            const parentTweet = tweets_1.tweets.find(tweet => tweet.id === this.parentId);
            if (parentTweet) {
                console.log(`  (In reply to @${parentTweet.user.username}: "${parentTweet.content}")\n`);
            }
        }
        const tweetLikes = likes_1.likes.filter(like => like.tweet.id === this.id);
        if (tweetLikes.length === 1) {
            console.log(`[@${tweetLikes[0].user.username} liked this]`);
        }
        else if (tweetLikes.length === 2) {
            console.log(`[@${tweetLikes[0].user.username} and 1 other user liked this]`);
        }
        else if (tweetLikes.length > 2) {
            console.log(`[@${tweetLikes[0].user.username} and other ${tweetLikes.length - 1} users liked this]`);
        }
        const tweetReplies = replies_1.replies.filter(reply => reply.type === 'reply' && reply.parentId === this.id);
        if (tweetReplies.length > 0) {
            tweetReplies.forEach(reply => {
                console.log(`  >@${reply.user.username}: ${reply.content}`);
                const replyLikes = likes_1.likes.filter(like => like.tweet.id === reply.id);
                if (replyLikes.length === 1) {
                    console.log(`  [@${replyLikes[0].user.username} liked this]`);
                }
                else if (replyLikes.length === 2) {
                    console.log(`    [@${replyLikes[0].user.username} and 1 other user liked this]`);
                }
                else if (replyLikes.length > 2) {
                    console.log(`    [@${replyLikes[0].user.username} and ${replyLikes.length - 1} others liked this]`);
                }
            });
        }
    }
    showReplies(indentLevel = 1) {
        const tweetReplies = replies_1.replies.filter(reply => reply.parentId === this.id);
        if (tweetReplies.length > 0) {
            tweetReplies.forEach(reply => {
                const indent = ' '.repeat(indentLevel * 4);
                console.log(`${indent}>@${reply.user.username}: ${reply.content}`);
                const replyLikes = likes_1.likes.filter(like => like.tweet.id === reply.id);
                if (replyLikes.length === 1) {
                    console.log(`${indent}[@${replyLikes[0].user.username} liked this]`);
                }
                else if (replyLikes.length === 2) {
                    console.log(`${indent}[@${replyLikes[0].user.username} and 1 other user liked this]`);
                }
                else if (replyLikes.length > 2) {
                    console.log(`${indent}[@${replyLikes[0].user.username} and other ${replyLikes.length - 1} users liked this]`);
                }
                reply.showReplies(indentLevel + 1);
            });
        }
    }
    toJson() {
        return {
            id: this.id,
            user: this._user,
            content: this._content,
            type: this._type
        };
    }
}
exports.Tweet = Tweet;
