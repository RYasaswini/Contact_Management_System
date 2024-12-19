
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Use 'required' instead of 'require'
    },
    email: {
        type: String,
        required: true, // Use 'required' instead of 'require'
        unique: true
    },
    phone: {
        type: String,
        required: true, // Use 'required' instead of 'require'
        unique: true
    },
    address: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Ensure this matches your User model's name
    }
});

const ContactModel = mongoose.model("Contact", ContactSchema); // Use 'Contact' for consistency

export { ContactModel };
