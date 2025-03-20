import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const callSchema = new Schema({
    callerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'missed'],
        default: 'ongoing',
    },
    isVideoCall: {
        type: Boolean,
        default: false,
    },
    videoUrl: {
        type: String,
        required: function() { return this.isVideoCall; },
    },
});

const Call = model('Call', callSchema);

export default Call;