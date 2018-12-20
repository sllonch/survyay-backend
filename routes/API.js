const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Survey = require('../models/survey')
const { isLoggedIn } = require('../helpers/middlewares')
const ObjectId = require('mongoose').Types.ObjectId
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get('/surveys', isLoggedIn(), (req, res, next) => {
  const userId = req.session.currentUser._id
  Survey.find({ $or: [ { 'participants.participant': ObjectId(userId), 'participants.hasVoted': true }, { 'participants.participant': ObjectId(userId), 'participants.hasVoted': false } ] }) // Finds all the surveys where currentUser is in the list of participants
    .then((surveys) => {
      if (!surveys) {
        res.status(404).json({
          error: 'Surveys not found'
        })
      }
      res.status(200).json(surveys)
    })
    .catch(() => {
      res.json('Error getting the list of surveys').status(500)
    })
})

router.get('/mysurveys', isLoggedIn(), (req, res, next) => {
  const userId = req.session.currentUser._id
  Survey.find({ owner: ObjectId(userId) }) // Finds all the surveys that currentUser has created
    .then((surveys) => {
      if (!surveys) {
        res.status(404).json({
          error: 'Surveys not found'
        })
      }
      res.status(200).json(surveys)
    })
    .catch(() => {
      res.json('Error getting your list of surveys').status(500)
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
      error: 'Some Survey field is empty'
    })
  }

  const emails = participants.map(participant => participant.email) // Converting an array of objects with the key "email" to an array of emails

  User.find({ email: { $in: emails } })
    .then((users) => {
      if (!users) {
        return res.status(404).json({
          error: 'Users not found'
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
        const msg = {
          to: emails.toString(),
          from: 'survyay@survyay.com',
          subject: 'You have been invited to participate in a new Survey!',
          text: `Please log into https://survyays.firebaseapp.com/login and vote in the following survay: ${newSurvey.title}`,
          html: `Please log into <link>https://survyays.firebaseapp.com/login</link> and vote in the following survay: <strong>${newSurvey.title}</strong>`
        }
        sgMail.send(msg)
        res.status(200).json(newSurvey)
      })
    })
    .catch(next => console.log(next))
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
      res.json('Error getting the Survey').status(500)
    })
})

router.put('/survey/:id/vote', isLoggedIn(), (req, res, next) => {
  const id = req.params.id
  const {
    answer,
    userId
  } = req.body

  console.log(answer)

  if (!ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid Survey id' }).status(401)
  }

  if (!answer || !userId) {
    return res.status(422).json({
      error: 'Empty answer'
    })
  }

  Survey.findById(id) // Finds the Survey
    .then((survey) => {
      if (!survey) {
        res.status(404).json({
          error: 'Survey not found'
        })
      }
      for (let i = 0; i < survey.participants.length; i++) {
        if (survey.participants[i].participant.equals(userId) && survey.participants[i].hasVoted === true) {
          return res.status(401).json({ error: 'You already voted' }) // If user already voted return and send error message
        }
      }
      const { answers, participants } = survey
      const indexAnswer = answers.findIndex(x => x.answerTitle === answer)
      if (indexAnswer === -1) {
        return res.status(422).json({
          error: 'Answer not found'
        })
      }
      answers[indexAnswer].votes++
      const indexParticipant = participants.findIndex(y => y.participant.equals(userId))
      if (indexParticipant === -1) {
        return res.status(422).json({
          error: 'Particiant not found'
        })
      }
      participants[indexParticipant].hasVoted = true
      return Survey.findByIdAndUpdate(id, { $set: { answers, participants } }) // Stores the vote in the Database
        .then((survey) => {
          if (!survey) {
            res.status(404).json({
              error: 'Survey not found'
            })
          }
          res.status(200).json(survey)
        })
        .catch(() => {
          res.json({ error: 'Error updating the Survey' }).status(500)
        })
    })
    .catch(() => {
      res.json({ error: 'Error finding the Survey' }).status(500)
    })
})

router.put('/survey/:id/add', isLoggedIn(), (req, res, next) => {
  const id = req.params.id
  let {
    participants
  } = req.body

  if (!participants) {
    return res.status(422).json({
      error: 'No participants were added'
    })
  }

  const emails = participants.map(participant => participant.email) // Converting an array of objects with the key "email" to an array of emails

  User.find({ email: { $in: emails } })
    .then((users) => {
      if (!users) {
        return res.status(404).json({
          error: 'Users not found'
        })
      }
      participants = users.map(user => user._id)
      const newParticipants = participants.map(part => {
        return { participant: part, hasVoted: false }
      })

      Survey.findByIdAndUpdate(id, { $push: { participants: newParticipants } })
        .then((survey) => {
          if (!survey) {
            res.status(404).json({
              error: 'Survey not found'
            })
          }
          const msg = {
            to: emails.toString(),
            from: 'survyay@survyay.com',
            subject: 'You have been invited to participate in a new Survey!',
            text: `Please log into https://survyays.firebaseapp.com/login and vote in the following survay: ${survey.title}`,
            html: `Please log into <link>https://survyays.firebaseapp.com/login</link> and vote in the following survay: <strong>${survey.title}</strong>`
          }
          sgMail.send(msg)
          res.status(200).json(survey)
        })
        .catch(() => {
          res.json('Error updating the Survey').status(500)
        })
    })
    .catch(next)
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
      res.json('Error deleting the Survey').status(500)
    })
})

module.exports = router
