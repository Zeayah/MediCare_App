import { initiateCall, endCall, getUserCallHistory } from '../services/Callservice.js';
import { formatCallData } from '../helpers/Callhelpers.js';

/**
 * Start a new call.
 */
export async function startCall(req, res) {
    try {
        const callData = {
            callerId: req.user._id, // Assuming user is attached by auth middleware
            receiverId: req.body.receiverId,
            isVideoCall: req.body.isVideoCall,
            videoUrl: req.body.videoUrl
        };

        const newCall = await initiateCall(callData);
        res.status(201).json(formatCallData(newCall));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * End an ongoing call.
 */
export async function finishCall(req, res) {
    try {
        const { callId } = req.params;
        const { status } = req.body;

        const updatedCall = await endCall(callId, status);
        res.json(formatCallData(updatedCall));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get call history for the authenticated user.
 */
export async function getCallHistory(req, res) {
    try {
        const userId = req.user._id; // Assuming user is attached by auth middleware
        const calls = await getUserCallHistory(userId);
        res.json(calls.map(formatCallData));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}