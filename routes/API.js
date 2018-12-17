const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Survey = require('../models/survey')
const { isLoggedIn } = require('../helpers/middlewares')
// const ObjectId = require('mongoose').Types.ObjectId

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
  let {
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

  const emails = participants.map(participant => participant.email) // Converting an array of objects with the key "email" to an array of emails

  User.find({ email: { $in: emails } })
    .then((users) => {
      console.log(users)
      if (!users) {
        return res.status(404).json({
          error: 'Users-not-found'
        })
      }
      participants = users.map(user => user._id)
      const newParticipants = participants.map(part => {
        return { participant: part, hasVoted: false }
      })
      console.log(newParticipants)

      const newSurvey = Survey({
        participants: newParticipants,
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

      // Survey.findByIdAndUpdate(id, { $set: { answers, participants } }) // Stores the vote in the Database
      //   .then((survey) => {
      //     if (!survey) {
      //       res.status(404).json({
      //         error: 'Not-found'
      //       })
      //     }
      //     console.log(survey)
      //     res.status(200).json(survey)
      //   })
      //   .catch(() => {
      //     res.json('Error').status(500)
      //   })

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

router.delete('/survey/:id/delete', isLoggedIn(), (req, res, next) => {
  const id = req.params.id
  console.log(id)
  Survey.findByIdAndDelete(id)
    .then((survey) => {
      res.status(200).json(survey)
    })
    .catch(() => {
      res.json('Error').status(500)
    })
})

module.exports = router
