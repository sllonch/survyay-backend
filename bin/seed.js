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
    email: 'paquito@paquitotest.com',
    password: '123456'
  },
  {
    name: 'Pepito',
    email: 'pepito@pepitotest.com',
    password: '123456'
  },
  {
    name: 'Papito',
    email: 'papito@papitotest.com',
    password: '123456'
  },
  {
    name: 'Paquito Jr',
    email: 'paquitojr@paquitotest.com',
    password: '123456'
  },
  {
    name: 'Pepito Jr',
    email: 'pepitojr@pepitotest.com',
    password: '123456'
  },
  {
    name: 'Papito Jr',
    email: 'papitojr@papitotest.com',
    password: '123456'
  },
  {
    name: 'Paquito Sr',
    email: 'paquitosr@paquitotest.com',
    password: '123456'
  },
  {
    name: 'Pepito Sr',
    email: 'pepitosr@pepitotest.com',
    password: '123456'
  },
  {
    name: 'Papito Sr',
    email: 'papitosr@papitotest.com',
    password: '123456'
  },
  {
    name: 'Paquita',
    email: 'paquita@paquitotest.com',
    password: '123456'
  },
  {
    name: 'Pepita',
    email: 'pepita@pepitotest.com',
    password: '123456'
  },
  {
    name: 'Papita',
    email: 'papita@papitotest.com',
    password: '123456'
  },
  {
    name: 'Paquita Jr',
    email: 'paquitajr@paquitotest.com',
    password: '123456'
  },
  {
    name: 'Pepito Jr',
    email: 'pepitajr@pepitotest.com',
    password: '123456'
  },
  {
    name: 'Papito Jr',
    email: 'papitajr@papitotest.com',
    password: '123456'
  },
  {
    name: 'Paquita Sr',
    email: 'paquitasr@paquitotest.com',
    password: '123456'
  },
  {
    name: 'Pepita Sr',
    email: 'pepitasr@pepitotest.com',
    password: '123456'
  },
  {
    name: 'Papita Sr',
    email: 'papitasr@papitotest.com',
    password: '123456'
  },
  {
    name: 'Sergi',
    email: 'sllonk@gmail.com',
    password: '123456'
  },
  {
    name: 'Sergi',
    email: 'testsurvyay@test.com',
    password: '123456'
  },
  {
    name: 'User',
    email: 'survyays@gmail.com',
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
    title: 'What is your favorite music artist of 2018?',
    answers: [
      { answerTitle: 'Cardi B', votes: 1 },
      { answerTitle: 'Idles', votes: 3 },
      { answerTitle: 'Low', votes: 3 },
      { answerTitle: 'Rosalía', votes: 3 },
      { answerTitle: 'Mitski', votes: 2 }
    ]
  },
  {
    title: 'How many beers will you drink this Friday?',
    answers: [
      { answerTitle: '0', votes: 2 },
      { answerTitle: '1', votes: 1 },
      { answerTitle: '2', votes: 1 },
      { answerTitle: '3', votes: 1 },
      { answerTitle: '4', votes: 2 },
      { answerTitle: '4+', votes: 5 }
    ]
  },
  {
    title: 'Is Alejo Daudí the funniest man on Earth?',
    answers: [
      { answerTitle: 'Yes', votes: 5 },
      { answerTitle: 'Of course', votes: 5 },
      { answerTitle: 'Not really', votes: 2 }
    ]
  }
]

User.create(users)
  .then((users) => {
    console.log('users created')
    surveys[0].participants = [
      { participant: users[0]._id, hasVoted: true },
      { participant: users[1]._id, hasVoted: true },
      { participant: users[2]._id, hasVoted: false },
      { participant: users[3]._id, hasVoted: true },
      { participant: users[4]._id, hasVoted: true },
      { participant: users[5]._id, hasVoted: false },
      { participant: users[6]._id, hasVoted: true },
      { participant: users[7]._id, hasVoted: true },
      { participant: users[8]._id, hasVoted: false },
      { participant: users[9]._id, hasVoted: true },
      { participant: users[10]._id, hasVoted: true },
      { participant: users[11]._id, hasVoted: false },
      { participant: users[12]._id, hasVoted: true },
      { participant: users[13]._id, hasVoted: true },
      { participant: users[14]._id, hasVoted: false },
      { participant: users[15]._id, hasVoted: true },
      { participant: users[16]._id, hasVoted: true },
      { participant: users[17]._id, hasVoted: false },
      { participant: users[18]._id, hasVoted: false },
      { participant: users[19]._id, hasVoted: false },
      { participant: users[20]._id, hasVoted: false }
    ]
    surveys[0].owner = users[20]._id
    surveys[1].participants = [
      { participant: users[0]._id, hasVoted: true },
      { participant: users[1]._id, hasVoted: true },
      { participant: users[2]._id, hasVoted: false },
      { participant: users[3]._id, hasVoted: true },
      { participant: users[4]._id, hasVoted: true },
      { participant: users[5]._id, hasVoted: false },
      { participant: users[6]._id, hasVoted: true },
      { participant: users[7]._id, hasVoted: true },
      { participant: users[8]._id, hasVoted: false },
      { participant: users[9]._id, hasVoted: true },
      { participant: users[10]._id, hasVoted: true },
      { participant: users[11]._id, hasVoted: false },
      { participant: users[12]._id, hasVoted: true },
      { participant: users[13]._id, hasVoted: true },
      { participant: users[14]._id, hasVoted: false },
      { participant: users[15]._id, hasVoted: true },
      { participant: users[16]._id, hasVoted: true },
      { participant: users[17]._id, hasVoted: false },
      { participant: users[18]._id, hasVoted: false },
      { participant: users[19]._id, hasVoted: false },
      { participant: users[20]._id, hasVoted: false }
    ]
    surveys[1].owner = users[20]._id
    surveys[2].participants = [
      { participant: users[0]._id, hasVoted: true },
      { participant: users[1]._id, hasVoted: true },
      { participant: users[2]._id, hasVoted: false },
      { participant: users[3]._id, hasVoted: true },
      { participant: users[4]._id, hasVoted: true },
      { participant: users[5]._id, hasVoted: false },
      { participant: users[6]._id, hasVoted: true },
      { participant: users[7]._id, hasVoted: true },
      { participant: users[8]._id, hasVoted: false },
      { participant: users[9]._id, hasVoted: true },
      { participant: users[10]._id, hasVoted: true },
      { participant: users[11]._id, hasVoted: false },
      { participant: users[12]._id, hasVoted: true },
      { participant: users[13]._id, hasVoted: true },
      { participant: users[14]._id, hasVoted: false },
      { participant: users[15]._id, hasVoted: true },
      { participant: users[16]._id, hasVoted: true },
      { participant: users[17]._id, hasVoted: false },
      { participant: users[18]._id, hasVoted: false },
      { participant: users[19]._id, hasVoted: false },
      { participant: users[20]._id, hasVoted: false }
    ]
    surveys[2].owner = users[20]._id
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
