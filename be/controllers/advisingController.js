// controllers/advisingController.js

import Advising from "../models/advising.js";

// Get all advisings
export const getAllAdvisings = async (req, res) => {
    try {
        // Sort advisings by createdAt in descending order
        const advisings = await Advising.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: advisings.length,
            data: advisings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Errror while fetching advisings',
            error: error.message
        });
    }
};

// Create a new advising
export const createAdvising = async (req, res) => {
    try {
        const { fullName, email, phone, address, notes } = req.body;

        if (!fullName || !email || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const newAdvising = new Advising({
            fullName,
            email,
            phone,
            address,
            notes: notes || ''
        });

        await newAdvising.save();

        res.status(201).json({
            success: true,
            message: 'Advising created successfully',
            data: newAdvising
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while creating advising',
            error: error.message
        });
    }
};

// Delete an advising
export const deleteAdvising = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the provided ID is a valid MongoDB ID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID'
            });
        }
        const advising = await Advising.findByIdAndDelete(id);

        if (!advising) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find advising with this ID '
            });
        }

        res.status(200).json({
            success: true,
            message: 'Advising deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while deleting advising',
            error: error.message
        });
    }
};

// Get a single advising by ID
export const getAdvisingById = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the provided ID is a valid MongoDB ID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID'
            });
        }

        const advising = await Advising.findById(id);

        if (!advising) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find advising with this ID '
            });
        }

        res.status(200).json({
            success: true,
            data: advising
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while fetching advising',
            error: error.message
        });
    }
};