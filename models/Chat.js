const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const chatSchema = new Schema({
  users: {
    type: [ObjectId],
    ref: 'User'
  },
  messages: {
    type: [ObjectId],
    ref: 'Message'
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
