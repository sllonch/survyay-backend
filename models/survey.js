const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = Schema.Types.ObjectId

const surveySchema = new Schema({
  participants: [{
    participant: {
      type: ObjectID,
      ref: 'User'
    },
    hasVoted: Boolean
  }],
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
