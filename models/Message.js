const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  message: {
    type: String
  },
  notification: {
    emitter: ObjectId,
    toUser: ObjectId,
    isViewed: {
      type: Boolean,
      default: false
    }
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
