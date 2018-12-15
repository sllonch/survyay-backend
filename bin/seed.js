require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/user')
const Survey = require('../models/survey')

// -- bcrypt
const bcrypt = require('bcrypt')
const saltRounds = 10

mongoose.connect(
  process.env.MONGODB_URI,
  {
    keepAlive: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE
  }
)

// Users seed
const users = [
  {
    name: 'Paquito',
    email: 'paquito@gmail.com',
    password: '123456'
  },
  {
    name: 'Pepito',
    email: 'pepito@gmail.com',
    password: '123456'
  },
  {
    name: 'Sergi',
    email: 'sllonk@gmail.com',
    password: '123456'
  }
]

users.forEach(user => {
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(user.password, salt)
  user.password = hashedPassword
})

// Surveys seed

const surveys = [
  {
    title: 'Is Alejo Daudí the funniest man on Earth?',
    answers: [
      { answerTitle: 'Yes', votes: 1 },
      { answerTitle: 'Of course', votes: 1 },
      { answerTitle: 'Not really', votes: 0 }
    ]
  },
  {
    title: 'How many beers will you drink this Friday?',
    answers: [
      { answerTitle: '0', votes: 0 },
      { answerTitle: '1', votes: 0 },
      { answerTitle: '2', votes: 0 },
      { answerTitle: '3', votes: 0 },
      { answerTitle: '4', votes: 0 },
      { answerTitle: '5', votes: 0 },
      { answerTitle: '5+', votes: 1 }
    ]
  }
]

User.create(users)
  .then((users) => {
    console.log('users created')
    surveys[0].participants = [
      { participant: users[0]._id, hasVoted: true },
      { participant: users[1]._id, hasVoted: true },
      { participant: users[2]._id, hasVoted: false }
    ]
    surveys[0].owner = users[2]._id
    surveys[1].participants = [
      { participant: users[0]._id, hasVoted: true },
      { participant: users[1]._id, hasVoted: false },
      { participant: users[2]._id, hasVoted: false }
    ]
    surveys[1].owner = users[2]._id
    Survey.create(surveys)
      .then(() => {
        console.log('surveys created')
      })
      .catch(error => {
        console.error(error)
      })
  })
  .catch(error => {
    console.error(error)
  })
