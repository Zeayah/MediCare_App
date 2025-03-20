// src/models/notificationModel.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['appointment', 'message', 'call', 'system'],
        default: 'info',
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Notification = model('Notification', notificationSchema);

export default Notification;