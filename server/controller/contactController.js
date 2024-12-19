import express from 'express';
import { ContactModel } from '../models/Contact.js';

const createContact = async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        const newContact = new ContactModel({
            name,
            email,
            phone,
            address,
            postedBy: req.user._id
        });

        const result = await newContact.save();
        return res.status(201).json({ success: true, ...result._doc });
    } catch (err) {
        console.error('Error creating contact:', err);
        
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Phone number already exists' });
        }

        return res.status(500).json({ error: 'Failed to create contact' });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find({ postedBy: req.user._id });
        return res.status(200).json({ success: true, contacts });
    } catch (err) {
        console.error('Error fetching contacts:', err);
        return res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

const getContact = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "No Id Specified" });
    }
    try {
        const contact = await ContactModel.findOne({ _id: id });
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        return res.status(200).json({ success: true, ...contact._doc });
    } catch (err) {
        console.error('Error fetching contact:', err);
        return res.status(500).json({ error: err.message });
    }
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "No Id Specified" });
    }

    try {
        // Attempt to update contact
        const result = await ContactModel.findByIdAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        return res.status(200).json({ success: true, ...result._doc });
    } catch (err) {
        console.error('Error updating contact:', err);

        // Handle duplicate key error during update
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Phone number already exists' });
        }

        return res.status(500).json({ error: 'Failed to update contact' });
    }
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "No Id Specified" });
    }
    try {
        const contact = await ContactModel.findOne({ _id: id });
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        const deleteRecord =await ContactModel.findByIdAndDelete({_id: id})
        const contacts =await ContactModel.find({postedBy: req.user._id})
        return res.status(200).json({ success: true, contacts });
    } catch (err) {
        console.error('Error fetching contact:', err);
        return res.status(500).json({ error: err.message });
    }
};

export { createContact, getContacts, getContact, updateContact,deleteContact };
