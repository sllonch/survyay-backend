const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = require('mongodb').ObjectID

const surveySchema = new Schema({
  participants: Array,
  title: String,
  answers: Array,
  owner: {
    type: ObjectID,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Survey = mongoose.model('Survey', surveySchema)

module.exports = Survey
