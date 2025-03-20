import mongoose from "mongoose";



const appointmentSchema = new mongoose.Schema({
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the patient
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the doctor
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  });
  
  const Appointment = mongoose.model('Appointment', appointmentSchema);
  
  export default Appointment;