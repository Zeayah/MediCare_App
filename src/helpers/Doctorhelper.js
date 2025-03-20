 import Doctor from '../models/Doctormodel.js';

/**
 * Find available slots for a doctor. 
 * @param {string} doctorId - The ID of the doctor.
 * @returns {Promise<Array>} - A promise that resolves to an array of available slots.
 */
export async function findAvailableSlots(doctorId) {
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor.availableSlots;
    } catch (error) {
        console.error('Error finding available slots:', error);
        throw error;
    }
}

/**
 * Format doctor information for display.
 * @param {Object} doctor - The doctor object.
 * @returns {Object} - Formatted doctor information.
 */
export function formatDoctorInfo(doctor) {
    return {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        location: {
            type: doctor.location.type,
            coordinates: doctor.location.coordinates,
        },
    };
}

/**
 * Find doctors near a given location.
 * @param {Array} coordinates - The [longitude, latitude] of the location.
 * @param {number} maxDistance - The maximum distance in meters.
 * @returns {Promise<Array>} - A promise that resolves to an array of nearby doctors.
 */
export async function findDoctorsNearLocation(coordinates, maxDistance) {
    try {
        const doctors = await Doctor.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coordinates,
                    },
                    $maxDistance: maxDistance,
                },
            },
        });
        return doctors;
    } catch (error) {
        console.error('Error finding doctors near location:', error);
        throw error;
    }
}