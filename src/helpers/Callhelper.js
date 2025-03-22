/**
 * Format call data for display or response.
 * @param {Object} call - The call object.
 * @returns {Object} - Formatted call data.
 */
export function formatCallData(call) {
    return {
        id: call._id,
        caller: call.callerId,
        receiver: call.receiverId,
        startTime: call.startTime,
        endTime: call.endTime,
        status: call.status,
        isVideoCall: call.isVideoCall,
        videoUrl: call.videoUrl,
        duration: call.endTime ? calculateCallDuration(call) : null
    };
}

/**
 * Calculate call duration in minutes.
 * @param {Object} call - The call object with start and end times.
 * @returns {number} - Duration in minutes.
 */
export function calculateCallDuration(call) {
    if (!call.startTime || !call.endTime) return 0;
    return Math.round((new Date(call.endTime) - new Date(call.startTime)) / 60000);
}

/**
 * Validate call status.
 * @param {string} status - Status to validate.
 * @returns {boolean} - Whether the status is valid.
 */
export function isValidCallStatus(status) {
    return ['ongoing', 'completed', 'missed'].includes(status);
}