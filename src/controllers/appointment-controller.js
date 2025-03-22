import {
    createNewAppointment,
    findAllAppointments,
    findAppointmentById,
    updateAppointmentById,
    deleteAppointmentById,
    findAppointmentsByPatient,
    findAppointmentsByDoctor
} from '../services/appointment-services/index.js';
import { validateAppointment, validateStatusUpdate } from '../services/appointment-services/validation.js';
import createHttpError from 'http-errors';

/**
 * Create new appointment
 */
export const createAppointment = async (req, res) => {
    try {
        // Validate appointment data
        validateAppointment(req.body);

        // If user is a patient, use their ID
        const appointmentData = {
            ...req.body,
            patientId: req.user.role === 'Patient' ? req.user._id : req.body.patientId
        };

        const appointment = await createNewAppointment(appointmentData);
        
        res.status(201).json({
            success: true,
            data: { appointment }
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        throw error;
    }
};

/**
 * Get all appointments (admin only)
 */
export const getAllAppointments = async (req, res) => {
    try {
        // Only admin can see all appointments
        if (req.user.role !== 'Admin') {
            throw createHttpError(403, 'Not authorized to view all appointments');
        }

        const appointments = await findAllAppointments();
        
        res.status(200).json({
            success: true,
            data: { appointments }
        });
    } catch (error) {
        console.error('Get all appointments error:', error);
        throw error;
    }
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        if (!appointmentId) {
            throw createHttpError(400, 'Appointment ID is required');
        }

        const appointment = await findAppointmentById(appointmentId);
        
        // Check if user has permission to view this appointment
        if (req.user.role !== 'Admin' && 
            req.user._id.toString() !== appointment.patientId.toString() && 
            req.user._id.toString() !== appointment.doctorId.toString()) {
            throw createHttpError(403, 'Not authorized to view this appointment');
        }

        res.status(200).json({
            success: true,
            data: { appointment }
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        throw error;
    }
};

/**
 * Update appointment
 */
export const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const updateData = req.body;
        
        if (!appointmentId) {
            throw createHttpError(400, 'Appointment ID is required');
        }

        // If only updating status, use status validation
        if (Object.keys(updateData).length === 1 && updateData.status) {
            validateStatusUpdate(updateData);
        } else {
            validateAppointment({ ...updateData, appointmentId });
        }

        // Get existing appointment to check permissions
        const existingAppointment = await findAppointmentById(appointmentId);
        
        // Only admin, the patient, or the doctor can update the appointment
        if (req.user.role !== 'Admin' && 
            req.user._id.toString() !== existingAppointment.patientId.toString() && 
            req.user._id.toString() !== existingAppointment.doctorId.toString()) {
            throw createHttpError(403, 'Not authorized to update this appointment');
        }

        const appointment = await updateAppointmentById(appointmentId, updateData);
        
        res.status(200).json({
            success: true,
            data: { appointment }
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        throw error;
    }
};

/**
 * Delete appointment
 */
export const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        if (!appointmentId) {
            throw createHttpError(400, 'Appointment ID is required');
        }

        // Get existing appointment to check permissions
        const existingAppointment = await findAppointmentById(appointmentId);
        
        // Only admin, the patient, or the doctor can delete the appointment
        if (req.user.role !== 'Admin' && 
            req.user._id.toString() !== existingAppointment.patientId.toString() && 
            req.user._id.toString() !== existingAppointment.doctorId.toString()) {
            throw createHttpError(403, 'Not authorized to delete this appointment');
        }

        await deleteAppointmentById(appointmentId);
        
        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        throw error;
    }
};

/**
 * Get patient's appointments
 */
export const getPatientAppointments = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Only admin or the patient themselves can view their appointments
        if (req.user.role !== 'Admin' && req.user._id.toString() !== patientId) {
            throw createHttpError(403, 'Not authorized to view these appointments');
        }

        const appointments = await findAppointmentsByPatient(patientId);
        
        res.status(200).json({
            success: true,
            data: { appointments }
        });
    } catch (error) {
        console.error('Get patient appointments error:', error);
        throw error;
    }
};

/**
 * Get doctor's appointments
 */
export const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        // Only admin or the doctor themselves can view their appointments
        if (req.user.role !== 'Admin' && req.user._id.toString() !== doctorId) {
            throw createHttpError(403, 'Not authorized to view these appointments');
        }

        const appointments = await findAppointmentsByDoctor(doctorId);
        
        res.status(200).json({
            success: true,
            data: { appointments }
        });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        throw error;
    }
}; 