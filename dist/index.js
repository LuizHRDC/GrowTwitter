"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./entities/User");
const Tweet_1 = require("./entities/Tweet");
const types_1 = require("./types/types");
// Instanciação de usuários
const user1 = new User_1.User('Louis', 'louie@email.com', 'louie', 'password');
const user2 = new User_1.User('Emma', 'emma@email.com', 'emma', 'secretPassword');
const user3 = new User_1.User('Louis', 'louis@email.com', 'louie', '123456'); // Username duplicado
const user4 = new User_1.User('Isabella', 'isabella@email.com', 'bella_', '654321');
const user5 = new User_1.User('William', 'will@email.com', 'will', '789456');
const user6 = new User_1.User('Lana', 'lana@email.com', 'lana', 'luckyPassword123');
// Criando usuários instanciados previamente e adicionando ao array de users. Aqui são realizadas as devidas validações.
User_1.User.createUser(user1); // Criado
User_1.User.createUser(user2);
User_1.User.createUser(user3); // Não criado (username duplicado)
User_1.User.createUser(user4);
User_1.User.createUser(user5);
User_1.User.createUser(user6);
// Follows
user1.follow(user2);
user1.follow(user4);
user1.follow(user5);
user2.follow(user4);
user2.follow(user5);
user2.follow(user6);
user4.follow(user1);
user1.follow(user3); // Usuário não cadastrado
user1.follow(user1); // Não pode seguir a si mesmo
// Tweets
const tweet1 = new Tweet_1.Tweet(user1, 'I love Growdev!', types_1.tweetType.normal);
const tweet2 = new Tweet_1.Tweet(user1, 'Hello, World!', types_1.tweetType.normal);
const tweet3 = new Tweet_1.Tweet(user2, "Let's go, growdevers!", types_1.tweetType.normal);
const tweet4 = new Tweet_1.Tweet(user4, "Happy New Year", types_1.tweetType.normal);
const tweet5 = new Tweet_1.Tweet(user6, "When in doubt, console.log()", types_1.tweetType.normal);
// sendTweet
user1.sendTweet(tweet1);
user1.sendTweet(tweet2);
user2.sendTweet(tweet3);
user4.sendTweet(tweet4);
user6.sendTweet(tweet5);
user4.sendTweet(tweet1); // Não pode enviar tweet de outro usuário
// Likes
tweet1.like(user2);
tweet1.like(user4);
tweet1.like(user5);
tweet3.like(user4);
tweet4.like(user2);
tweet1.like(user3); // Usuário não cadastrado
tweet1.like(user2); // Like duplicado
// Replies
const reply1 = new Tweet_1.Tweet(user2, 'Me too. Such an amazing startup!!', types_1.tweetType.reply);
tweet1.reply(reply1);
const reply2 = new Tweet_1.Tweet(user4, 'Hello, TypeScript!', types_1.tweetType.reply);
tweet2.reply(reply2);
const reply3 = new Tweet_1.Tweet(user4, 'Bora!!', types_1.tweetType.reply);
tweet3.reply(reply3);
const reply4 = new Tweet_1.Tweet(user2, 'Hello, JavaScript!', types_1.tweetType.reply);
reply2.reply(reply4);
// show() em tweets
console.log('\nMétodo show() abaixo:');
tweet1.show();
// showTweets()
console.log('\nMétodo showTweets() abaixo:');
user1.showTweets();
// showFeed()
console.log('\nMétodo showFeed() abaixo:');
user1.showFeed();
user2.showFeed();
// "O usuário deve ter acesso a lista de usuários a quem segue."
console.log('\nMétodo showFollowing() abaixo:\n');
user1.showFollowing();
// show() em replies
console.log('\nShow nas replies:');
reply1.show();
// Likes nas replies
console.log('Like nas replies:\n');
reply1.like(user4);
// showReplies()
console.log('\nMétodo showReplies() abaixo:\n');
tweet2.showReplies();
// Usuário toJson()
console.log('\nMétodo toJson() abaixo:\n');
console.log(user1.toJson());
