import Appointment from '../models/Appointmentmodel.js';

/**
 * Schedule a new appointment.
 * @param {Object} appointmentData - The data for the appointment.
 * @returns {Promise<Object>} - A promise that resolves to the created appointment.
 */
export async function scheduleAppointment(appointmentData) {
    try {
        const newAppointment = new Appointment(appointmentData);
        return await newAppointment.save();
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        throw error;
    }
}

/**
 * Update the status of an appointment.
 * @param {string} appointmentId - The ID of the appointment to update.
 * @param {string} status - The new status of the appointment.
 * @returns {Promise<Object>} - A promise that resolves to the updated appointment.
 */
export async function updateAppointmentStatus(appointmentId, status) {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
    }
}

/**
 * Find appointments for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} role - The role of the user ('patient' or 'doctor').
 * @returns {Promise<Array>} - A promise that resolves to an array of appointments.
 */
export async function findAppointmentsForUser(userId, role) {
    try {
        const query = role === 'patient' ? { patientId: userId } : { doctorId: userId };
        return await Appointment.find(query);
    } catch (error) {
        console.error('Error finding appointments for user:', error);
        throw error;
    }
}