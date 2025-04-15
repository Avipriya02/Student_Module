const { prisma } = require('../config/database');
const validator = require('validator');


// Create a new student

const createStudent = async (req, res) => {
    const { registrationNumber, name, class: studentClass, rollNo, contactNumber, status } = req.body;

    try {
        // Validate required fields
        if (!registrationNumber || !name || !studentClass || !rollNo || !contactNumber) {
            throw new Error("Required fields are missing.");
        }

        // Validate name format
        if (!validator.isAlpha(name)) {
            throw new Error("Name must contain alphabets only.");
        }

        // Validate roll number type
        if (typeof rollNo !== 'number') {
            throw new Error("Roll Number must be a number.");
        }

        // Check if registration number already exists
        const existingStudent = await prisma.students.findUnique({
            where: { registrationNumber }
        });

        if (existingStudent) {
            throw new Error("Student with this registration number already exists.");
        }

        // Check if roll number already exists for the class
        const existingRollOfClass = await prisma.students.findMany({
            where: {
                rollNo,
                class: studentClass
            }
        });
        if (existingRollOfClass.length > 0) {
            throw new Error("Roll Number already exists for the class.");
        }

        // Create student
        const result = await prisma.students.create({
            data: {
                registrationNumber,
                name,
                class: studentClass,
                rollNo,
                contactNumber,
                status: status ?? true // default to true if not provided
            }
        });

        res.status(201).json({ message: "Student created successfully", data: result });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Something Went Wrong!", error: err.message });
    }
};

// Get all active students with pagination

const getStudents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const students = await prisma.students.findMany({
            skip,
            take: limit,
            where: { status: true } // Only fetch active students
        });

        res.status(200).json({ message: "Active students data retrieved successfully", data: students });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Something Went Wrong!", error: err.message });
    }
};


// Get a student by registration number

const getStudentByRegistration = async (req, res) => {
    const regNoToBeFetched = req.params.regNo;

    try {
        if (!regNoToBeFetched) {
            throw new Error("Registration number must be provided.");
        }

        const student = await prisma.students.findUnique({
            where: { registrationNumber: regNoToBeFetched }
        });

        // Check if student exists and is active
        if (!student || student.status === false) {
            return res.status(404).json({ message: "Student not found or inactive." });
        }

        res.status(200).json({
            message: `Details of the student with registration number ${regNoToBeFetched}`,
            data: student
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Something went wrong!", error: err.message });
    }
};


// Update student details by registration number
 
const updateStudentByRegistration = async (req, res) => {
    const regNoToBeFetched = req.params.regNo;
    const { name, class: studentClass, rollNo, contactNumber, status, registrationNumber } = req.body;

    try {
        if (!regNoToBeFetched) {
            throw new Error("Registration number must be provided.");
        }

        // Prevent registration number change
        if (registrationNumber && registrationNumber != regNoToBeFetched) {
            throw new Error("Registration number cannot be updated.");
        }

        const student = await prisma.students.findUnique({
            where: { registrationNumber: regNoToBeFetched }
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Check if new roll number is already taken in the same class exclude self
        if (rollNo || studentClass) {
            const existingRoll = await prisma.students.findFirst({
                where: {
                    rollNo,
                    class: studentClass,
                    registrationNumber: { not: regNoToBeFetched }, // exclude current student
                }
            });
            if (existingRoll) {
                throw new Error("Roll Number already exists for the class.");
            }
        }

        // Update student details
        const updatedStudent = await prisma.students.update({
            where: { registrationNumber: regNoToBeFetched },
            data: {
                ...(name && { name }),
                ...(studentClass && { class: studentClass }),
                ...(rollNo && { rollNo }),
                ...(contactNumber && { contactNumber }),
                ...(status !== undefined && { status }),
            }
        });

        res.status(200).json({
            message: `Student updated successfully for registration number ${regNoToBeFetched}`,
            data: updatedStudent
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Something went wrong!", error: err.message });
    }
};


// Soft delete a student by setting their status to false

const deleteStudentByRegistration = async (req, res) => {
    const regNoToBeFetched = req.params.regNo;

    try {
        if (!regNoToBeFetched) {
            throw new Error("Registration number must be provided.");
        }

        const student = await prisma.students.findUnique({
            where: { registrationNumber: regNoToBeFetched }
        });

        // Ensure student exists and is not already inactive
        if (!student || student.status === false) {
            return res.status(404).json({ message: "Student not found or already inactive." });
        }

        // Soft delete student (set status to false)
        const deletedStudent = await prisma.students.update({
            where: { registrationNumber: regNoToBeFetched },
            data: {
                status: false
            }
        });

        res.status(200).json({
            message: `Student deleted successfully for registration number ${regNoToBeFetched}`,
            data: deletedStudent
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Something went wrong!", error: err.message });
    }
};

module.exports = {
    createStudent,
    getStudents,
    getStudentByRegistration,
    updateStudentByRegistration,
    deleteStudentByRegistration
};
