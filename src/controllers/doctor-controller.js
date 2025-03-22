import { 
    createDoctor, 
    getAllDoctors, 
    getDoctorById, 
    updateDoctor, 
    deleteDoctor 
} from '../services/doctor-services/index.js';
import createHttpError from 'http-errors';

/**
 * Create new doctor
 */
export const createDoctorProfile = async (req, res) => {
    try {
        const doctorData = req.body;
        const doctor = await createDoctor(doctorData);
        
        res.status(201).json({
            success: true,
            data: { doctor }
        });
    } catch (error) {
        console.error('Create doctor error:', error);
        throw error;
    }
};

/**
 * Get all doctors
 */
export const getAllDoctorProfiles = async (req, res) => {
    try {
        const doctors = await getAllDoctors();
        
        res.status(200).json({
            success: true,
            data: { doctors }
        });
    } catch (error) {
        console.error('Get all doctors error:', error);
        throw error;
    }
};

/**
 * Get doctor by ID
 */
export const getDoctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        if (!doctorId) {
            throw createHttpError(400, 'Doctor ID is required');
        }

        const doctor = await getDoctorById(doctorId);
        
        res.status(200).json({
            success: true,
            data: { doctor }
        });
    } catch (error) {
        console.error('Get doctor error:', error);
        throw error;
    }
};

/**
 * Update doctor profile
 */
export const updateDoctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const updateData = req.body;
        
        if (!doctorId) {
            throw createHttpError(400, 'Doctor ID is required');
        }

        const doctor = await updateDoctor(doctorId, updateData);
        
        res.status(200).json({
            success: true,
            data: { doctor }
        });
    } catch (error) {
        console.error('Update doctor error:', error);
        throw error;
    }
};

/**
 * Delete doctor profile
 */
export const deleteDoctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        if (!doctorId) {
            throw createHttpError(400, 'Doctor ID is required');
        }

        await deleteDoctor(doctorId);
        
        res.status(200).json({
            success: true,
            message: 'Doctor profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete doctor error:', error);
        throw error;
    }
}; 