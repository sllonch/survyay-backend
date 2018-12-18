const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Survey = require('../models/survey')
const { isLoggedIn } = require('../helpers/middlewares')
const ObjectId = require('mongoose').Types.ObjectId

router.get('/surveys', isLoggedIn(), (req, res, next) => {
  const userId = req.session.currentUser._id
  Survey.find({ $or: [ { participants: { participant: ObjectId(userId), hasVoted: true } }, { participants: { participant: ObjectId(userId), hasVoted: false } }] }) // Finds all the surveys where currentUser is in the list of participants
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

router.get('/mysurveys', isLoggedIn(), (req, res, next) => {
  const userId = req.session.currentUser._id
  Survey.find({ owner: ObjectId(userId) }) // Finds all the surveys that currentUser has created
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
      if (!users) {
        return res.status(404).json({
          error: 'Users-not-found'
        })
      }
      participants = users.map(user => user._id)
      const newParticipants = participants.map(part => {
        return { participant: part, hasVoted: false }
      })

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
      console.log(survey)
      if (!survey) {
        res.status(404).json({
          error: 'Not-found'
        })
      }
      const currentParticipant = {
        'participant': ObjectId(userId),
        'hasVoted': false
      }
      console.log('Current participant:', currentParticipant)
      console.log('Current Survey participants:', survey.participants)
      Survey.find({ currentParticipant: { $in: survey.participants } }) // Looks if the voter has not voted in that survey
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
