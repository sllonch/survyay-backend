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
    answers: ['Yes', 'Of course', 'Not really']
  },
  {
    title: 'How many beers will you drink this Friday?',
    answers: ['0', '1', '2', '3', '4', '5', '5+']
  }
]

User.create(users)
  .then((users) => {
    console.log('users created')
    surveys[0].participants = [users[0]._id, users[1]._id, users[2]._id]
    surveys[0].owner = users[2]._id
    surveys[1].participants = [users[0]._id, users[1]._id, users[2]._id]
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
