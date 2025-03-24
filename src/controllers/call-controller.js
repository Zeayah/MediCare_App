import { validateCall, validateCallUpdate } from '../services/call-services/validation.js';
import Call from '../models/Callmodel.js';
import createHttpError from 'http-errors';

/**
 * Initialize a new call
 */
export const initializeCall = async (req, res) => {
    try {
        validateCall(req.body);

        const call = await Call.create({
            ...req.body,
            status: 'scheduled'
        });

        await call.populate(['doctorId', 'patientId', 'appointmentId']);

        res.status(201).json({
            success: true,
            data: call
        });
    } catch (error) {
        console.error('Call initialization error:', error);
        throw error;
    }
};

/**
 * Start a scheduled call
 */
export const startCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const call = await Call.findById(callId);

        if (!call) {
            throw createHttpError(404, 'Call not found');
        }

        if (call.status !== 'scheduled') {
            throw createHttpError(400, 'Call cannot be started - invalid status');
        }

        call.status = 'ongoing';
        call.startTime = new Date();
        await call.save();

        await call.populate(['doctorId', 'patientId', 'appointmentId']);

        res.status(200).json({
            success: true,
            data: call
        });
    } catch (error) {
        console.error('Start call error:', error);
        throw error;
    }
};

/**
 * End an ongoing call
 */
export const endCall = async (req, res) => {
    try {
        const { callId } = req.params;
        validateCallUpdate(req.body);

        const call = await Call.findById(callId);

        if (!call) {
            throw createHttpError(404, 'Call not found');
        }

        if (call.status !== 'ongoing') {
            throw createHttpError(400, 'Call must be ongoing to end');
        }

        call.status = 'completed';
        call.endTime = new Date();
        if (req.body.notes) call.notes = req.body.notes;
        if (req.body.recordingUrl) call.recordingUrl = req.body.recordingUrl;

        await call.save();
        await call.populate(['doctorId', 'patientId', 'appointmentId']);

        res.status(200).json({
            success: true,
            data: call
        });
    } catch (error) {
        console.error('End call error:', error);
        throw error;
    }
};

/**
 * Get call details
 */
export const getCallDetails = async (req, res) => {
    try {
        const { callId } = req.params;
        const call = await Call.findById(callId)
            .populate(['doctorId', 'patientId', 'appointmentId']);

        if (!call) {
            throw createHttpError(404, 'Call not found');
        }

        res.status(200).json({
            success: true,
            data: call
        });
    } catch (error) {
        console.error('Get call details error:', error);
        throw error;
    }
};

/**
 * Get user's call history
 */
export const getCallHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const calls = await Call.find({
            $or: [
                { doctorId: userId },
                { patientId: userId }
            ]
        })
        .populate(['doctorId', 'patientId', 'appointmentId'])
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: calls
        });
    } catch (error) {
        console.error('Get call history error:', error);
        throw error;
    }
};

/**
 * Cancel a scheduled call
 */
export const cancelCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const call = await Call.findById(callId);

        if (!call) {
            throw createHttpError(404, 'Call not found');
        }

        if (call.status !== 'scheduled') {
            throw createHttpError(400, 'Only scheduled calls can be cancelled');
        }

        call.status = 'cancelled';
        await call.save();

        await call.populate(['doctorId', 'patientId', 'appointmentId']);

        res.status(200).json({
            success: true,
            data: call
        });
    } catch (error) {
        console.error('Cancel call error:', error);
        throw error;
    }
}; 