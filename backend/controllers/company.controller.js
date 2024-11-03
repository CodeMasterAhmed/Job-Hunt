// controllers/company.controller.js

import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import path from 'path';
import fs from 'fs';

// Register Company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if company already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Create new company
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Error registering company:", error);
        return res.status(500).json({
            message: "Server Error.",
            success: false
        });
    }
};

// Get All Companies for a User
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // Logged in user id
        const companies = await Company.find({ userId });
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({
            message: "Server Error.",
            success: false
        });
    }
};

// Get Company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("Error fetching company by ID:", error);
        return res.status(500).json({
            message: "Server Error.",
            success: false
        });
    }
};

// Update Company
export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { name, description, website, location, existingLogo, removeLogo } = req.body;

        // Find the existing company
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Update text fields if provided
        if (name) company.name = name;
        if (description) company.description = description;
        if (website) company.website = website;
        if (location) company.location = location;

        // Handle logo updates
        if (req.file) {
            // If there's an existing logo, delete it from Cloudinary
            if (company.logo) {
                // Extract public ID from existing logo URL
                const publicId = path.basename(company.logo).split('.')[0]; // Assumes URL ends with /<publicId>.<ext>
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Error deleting old logo from Cloudinary:", err);
                    // Optionally, you can decide whether to proceed or not
                }
            }

            // Upload new logo to Cloudinary
            const file = req.file;
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: 'company_logos' // Optional: specify a folder in Cloudinary
            });
            company.logo = cloudResponse.secure_url;
        } else if (removeLogo === 'true') {
            // If user wants to remove the logo
            if (company.logo) {
                // Extract public ID from existing logo URL
                const publicId = path.basename(company.logo).split('.')[0]; // Assumes URL ends with /<publicId>.<ext>
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Error deleting logo from Cloudinary:", err);
                    // Optionally, you can decide whether to proceed or not
                }
                company.logo = null;
            }
        } else if (existingLogo) {
            // If the existing logo is provided, retain it
            company.logo = existingLogo;
        }

        // Save the updated company
        await company.save();

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({
            message: "Server Error.",
            success: false
        });
    }
};
