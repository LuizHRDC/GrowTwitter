import { randomUUID } from 'crypto'
import { User } from './User'
import { tweetType } from '../types/types'
import { likes } from '../database/likes'
import { Like } from './Like'
import { Likeable } from '../types/types'
import { users } from '../database/users'
import { replies } from '../database/replies'
import { tweets } from '../database/tweets'
import { ID } from  './Identifier'

export class Tweet extends ID implements Likeable {
  
  constructor(
    private _user: User,
    private _content: string,
    private _type: tweetType,
    private parentId: string | null = null
  ) {
    super()
  }

  public get user(): User {
    return this._user
  }

  public get content(): string {
    return this._content
  }

  public get type(): string {
    return this._type
  }

  reply(replyTweet: Tweet) {
    replyTweet.parentId = this.id // Vincula o reply ao tweet atual
    replies.push(replyTweet)
  }

  like(user: User) {
    const userExists = users.some(u => u.id === user.id)
    
    if (!userExists) {
        console.log(`User not found!\n`)
        return
    }

    const validateLike = likes.some(like => like.user.id === user.id && like.tweet.id === this.id)
    if (validateLike) {
        console.log(`@${user.username} already liked this tweet.\n`)
        return
    }

    const newLike = new Like(user, this)
    likes.push(newLike)
    if (this._type === tweetType.reply) {
      console.log(`@${user.username} liked this reply: >@${this._user.username}: ${this._content}!`)
      return
    } else {
      console.log(`@${user.username} liked this tweet: >@${this._user.username}: ${this._content}!\n`)
    }
  }

  show() {
    console.log(`\n@${this._user.username}: ${this._content}`)

    if (this.type === 'reply' && this.parentId) {
      const parentTweet = tweets.find(tweet => tweet.id === this.parentId)
      if (parentTweet) {
        console.log(`  (In reply to @${parentTweet.user.username}: "${parentTweet.content}")\n`)
      }
    }
    const tweetLikes = likes.filter(like => like.tweet.id === this.id)
    if (tweetLikes.length === 1) {
      console.log(`[@${tweetLikes[0].user.username} liked this]`)
    } else if (tweetLikes.length === 2) {
      console.log(`[@${tweetLikes[0].user.username} and 1 other user liked this]`)
    } else if (tweetLikes.length > 2) {
      console.log(
        `[@${tweetLikes[0].user.username} and other ${
          tweetLikes.length - 1
        } users liked this]`
      )
    }

    const tweetReplies = replies.filter(reply => reply.type === 'reply' && reply.parentId === this.id)

    if (tweetReplies.length > 0) {
      tweetReplies.forEach(reply => {
        console.log(`  >@${reply.user.username}: ${reply.content}`)
        const replyLikes = likes.filter(like => like.tweet.id === reply.id)
        if (replyLikes.length === 1) {
          console.log(`  [@${replyLikes[0].user.username} liked this]`)
        } else if (replyLikes.length === 2) {
          console.log(
            `    [@${replyLikes[0].user.username} and 1 other user liked this]`
          )
        } else if (replyLikes.length > 2) {
          console.log(
            `    [@${replyLikes[0].user.username} and ${
              replyLikes.length - 1
            } others liked this]`
          )
        }
      })
    }
  }

  public showReplies(indentLevel: number = 1) {
    const tweetReplies = replies.filter(reply => reply.parentId === this.id)
  
    if (tweetReplies.length > 0) {
      tweetReplies.forEach(reply => {
        const indent = ' '.repeat(indentLevel * 4)
        console.log(`${indent}>@${reply.user.username}: ${reply.content}`)
  
        const replyLikes = likes.filter(like => like.tweet.id === reply.id)
        if (replyLikes.length === 1) {
          console.log(`${indent}[@${replyLikes[0].user.username} liked this]`)
        } else if (replyLikes.length === 2) {
          console.log(`${indent}[@${replyLikes[0].user.username} and 1 other user liked this]`)
        } else if (replyLikes.length > 2) {
          console.log(`${indent}[@${replyLikes[0].user.username} and other ${replyLikes.length - 1} users liked this]`)
        }
  
        reply.showReplies(indentLevel + 1)
      })
    }
  }
  
  
  public toJson() {
    return {
      id: this.id,
      user: this._user,
      content: this._content,
      type: this._type
    }
  }
}