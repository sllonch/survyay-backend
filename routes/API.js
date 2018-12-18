const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Survey = require('../models/survey')
const { isLoggedIn } = require('../helpers/middlewares')
const ObjectId = require('mongoose').Types.ObjectId

router.get('/surveys', isLoggedIn(), (req, res, next) => {
  const userId = req.session.currentUser._id
  Survey.find({ $or: [ { 'participants.participant': ObjectId(userId), 'participants.hasVoted': true }, { 'participants.participant': ObjectId(userId), 'participants.hasVoted': false } ] }) // Finds all the surveys where currentUser is in the list of participants
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
  if (!ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid Survey id' }).status(401)
  }
  Survey.findById(id)
    .then((survey) => {
      if (!survey) {
        res.status(404).json({
          error: 'Survey not found'
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

  if (!ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid Survey id' }).status(401)
  }

  if (!answer || !userId) {
    return res.status(422).json({
      error: 'Empty answer or userId'
    })
  }

  Survey.findById(id) // Finds the Survey
    .then((survey) => {
      if (!survey) {
        res.status(404).json({
          error: 'Not-found'
        })
      }
      for (let i = 0; i < survey.participants.length; i++) {
        if (survey.participants[i].participant.equals(userId) && survey.participants[i].hasVoted === true) {
          console.log('You already voted')
          return res.status(401).json({ error: 'You already voted' }) // If user already voted return and send error message
        }
      }
      const { answers, participants } = survey
      const indexAnswer = answers.findIndex(x => x.answerTitle === answer)
      answers[indexAnswer].votes++
      const indexParticipant = participants.findIndex(y => y.participant.equals(userId))
      participants[indexParticipant].hasVoted = true
      return Survey.findByIdAndUpdate(id, { $set: { answers, participants } }) // Stores the vote in the Database
        .then((survey) => {
          if (!survey) {
            res.status(404).json({
              error: 'Not-found'
            })
          }
          res.status(200).json(survey)
        })
        .catch(() => {
          res.json({ error: 'not found' }).status(500)
        })
    })
    .catch(() => {
      res.json({ error: 'last error' }).status(500)
    })
})

router.delete('/survey/:id/delete', isLoggedIn(), (req, res, next) => {
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid Survey id' }).status(401)
  }

  Survey.findByIdAndDelete(id)
    .then((survey) => {
      res.status(200).json(survey)
    })
    .catch(() => {
      res.json('Error').status(500)
    })
})

module.exports = router
