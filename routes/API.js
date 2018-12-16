const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Survey = require('../models/survey')

const { isLoggedIn } = require('../helpers/middlewares')
const ObjectId = require('mongoose').Types.ObjectId

/*
router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser)
  } else {
    res.status(404).json({
      error: 'not-found'
    })
  }
})

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({
      error: 'unauthorized'
    })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).json({
      error: 'validation'
    })
  }

  User.findOne({
    email
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: 'not-found'
        })
      }
      // TODO async bcrypt
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user
        return res.status(200).json(user)
      }
      return res.status(404).json({
        error: 'not-found'
      })
    })
    .catch(next)
})

router.post('/signup', (req, res, next) => {
  const {
    name,
    email,
    password
  } = req.body

  console.log(req.body)

  if (!name || !email || !password) {
    return res.status(422).json({
      error: 'empty'
    })
  }

  User.findOne({
    email
  }, 'email')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({
          error: 'email-not-unique'
        })
      }

      const salt = bcrypt.genSaltSync(10)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = User({
        name,
        email,
        password: hashPass
      })

      return newUser.save().then(() => {
        req.session.currentUser = newUser
        res.json(newUser)
      })
    })
    .catch(next)
})

router.post('/logout', (req, res) => {
  req.session.currentUser = null
  return res.status(204).send()
})
*/
router.get('/surveys', isLoggedIn(), (req, res, next) => {
  Survey.find()
    .then((surveys) => {
      if (!surveys) {
        res.status(404).json({
          error: 'Not-found'
        })
      }
      res.status(200).json(surveys)
    })
    .catch(() => {
      res.json('Error').status(500)
    })
})

router.post('/survey/new', isLoggedIn(), (req, res, next) => {
  const {
    participants,
    title,
    answers,
    owner
  } = req.body

  if (!participants || !title || !answers || !owner) {
    return res.status(422).json({
      error: 'empty'
    })
  }

  const emails = participants.map(participant => participant.email)

  console.log(emails)

  User.find({ email: { $in: emails } })
    .then((users) => {
      console.log(users)
      if (!users) {
        return res.status(404).json({
          error: 'Users-not-found'
        })
      }
      const participants = users.map(user => user._id)

      const newSurvey = Survey({
        participants,
        title,
        answers,
        owner
      })

      return newSurvey.save().then(() => {
        res.json(newSurvey)
      })
    })
    .catch(next)
})

router.get('/survey/:id', isLoggedIn(), (req, res, next) => {
  const id = req.params.id
  Survey.findById(id)
    .then((survey) => {
      if (!survey) {
        res.status(404).json({
          error: 'Not-found'
        })
      }
      res.status(200).json(survey)
    })
    .catch(() => {
      res.json('Error').status(500)
    })
})

router.put('/survey/:id/vote', isLoggedIn(), (req, res, next) => {
  const id = req.params.id
  const {
    answer,
    userId
  } = req.body
  Survey.findById(id) // Finds the Survey
    .then((survey) => {
      if (!survey) {
        res.status(404).json({
          error: 'Not-found'
        })
      }
      const { answers, participants } = survey
      let index = answers.findIndex(x => x.answerTitle === answer)
      answers[index].votes++
      index = participants.findIndex(y => y.participant == userId)
      participants[index].hasVoted = true
      Survey.findByIdAndUpdate(id, { $set: { answers, participants } }) // Stores the vote in the Database
        .then((survey) => {
          if (!survey) {
            res.status(404).json({
              error: 'Not-found'
            })
          }
          console.log(survey)
          res.status(200).json(survey)
        })
        .catch(() => {
          res.json('Error').status(500)
        })
    })
    .catch(() => {
      res.json('Error').status(500)
    })
})

module.exports = router
