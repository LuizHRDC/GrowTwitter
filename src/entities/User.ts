import { randomUUID } from 'crypto'
import { Tweet } from './Tweet'
import { tweets } from '../database/tweets'
import { Like } from './Like'
import { likes } from '../database/likes'
import { users } from '../database/users'
import { ID } from './Identifier'

export class User extends ID {
  private _following: User[] = []
  
  constructor(
    private _name: string,
    private _email: string,
    private _username: string,
    private _password: string
  ) {
    super()
    this._following = []
  }

  public get password(): string {
    return this._password
  }

  public get username(): string {
    return this._username
  }

  public get email(): string {
    return this._email
  }

  public get following(): User[] {
    return this._following
  }

  public sendTweet(tweet: Tweet) {
    if (this.id !== tweet.user.id) {
        console.log('You can not send a tweet from another user!\n')
      } else {
        tweets.push(tweet)
        console.log(`Tweet successfully sent by @${this.username}!\n`)
      }
  }

  public follow(user: User) {
    if (this.id === user.id) {
      console.log(`You can not follow yourself!\n`)
      return
    }
    const filter = users.some(u => this.username === user.username)
    if (filter) {
        console.log(`User not found!\n`)
    } else {
        this._following.push(user)
        console.log(`${this.username} is following ${user.username}\n`)
    }
  }

  showFollowing() {
    if (this.following.length === 0) {
      console.log(`@${this.username} is not following anyone yet.`)
    } else {
      console.log(`@${this.username} is following:`)
      this.following.forEach(user => {
        console.log(`- @${user.username}`)
      });
    }
  }

  showTweets() {
    console.log(`\nTweets from @${this._username}:\n`)
    const userTweets = tweets.filter((tweet) => tweet.user.id === this.id)
    userTweets.forEach((tweet) => {
      console.log(`@${tweet.user.username}: ${tweet.content}`)
      const tweetLikes = likes.filter((like) => like.tweet.id === tweet.id)
      if (tweetLikes.length === 1) {
        console.log(`[@${tweetLikes[0].user.username} liked this]`)
      } else if (tweetLikes.length === 2) {
        console.log(`[@${tweetLikes[0].user.username} and 1 other user liked this]`)
      } else if (tweetLikes.length > 2) {
        console.log(
          `[@${tweetLikes[0].user.username} and other ${tweetLikes.length - 1} users liked this]`
        )
      }
      tweet.showReplies()
        console.log('-----------------------------------')
    });
  }

  showFeed() {
    console.log(`\nFeed of @${this._username}\n`)
    const feed = tweets.filter(
      (tweet) =>
        this.id === tweet.user.id ||
        this._following.some((following) => following.id === tweet.user.id)
    )
    if (feed.length > 0) {
      feed.forEach((tweet) => {
        const tweetLikes = likes.filter((like) => like.tweet.id === tweet.id)
        console.log(`@${tweet.user.username}: ${tweet.content}`)
        if (tweetLikes.length === 1) {
          console.log(`[@${tweetLikes[0].user.username} liked this]`)
        } else if (tweetLikes.length === 2) {
          console.log(`[@${tweetLikes[0].user.username} and 1 other user liked this]`)
        } else if (tweetLikes.length > 2) {
          console.log(
            `[@${tweetLikes[0].user.username} and other ${tweetLikes.length - 1} users liked this]`
          )
        }
        tweet.showReplies()
        console.log('-----------------------------------')
      });
    } else {
      console.log('Your feed is empty.')
    }
  }

  static createUser(user: User): boolean {
    // Verifica se o username ou ID já existem
    const idExists = users.some((existingUser) => existingUser.id === user.id)
    const usernameExists = users.some(
      (existingUser) => existingUser.username === user.username
    )

    if (idExists || usernameExists) {
      console.log(`It was not possible to add this user. ID or Username already taken.\n`)
      return false
    }

    users.push(user)
    console.log(`User '@${user.username}' successfully signed up!\n`)
    return true
  }

  public toJson() {
    return {
      id: this.id,
      name: this._name,
      email: this._email,
      username: this._username,
      following: this._following.map((user) => user.username)
    }
  }
}
