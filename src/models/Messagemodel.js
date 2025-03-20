import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the sender
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the receiver
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Message = mongoose.model('Message', messageSchema);
  
  export default Message;