const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentByRegistration,
  updateStudentByRegistration,
  deleteStudentByRegistration
} = require('../controllers/studentController');

// Route to create a new student
router.post('/students', createStudent);

// Route to fetch all students
router.get('/students', getStudents);

// Route to fetch a student by registration number
router.get('/students/:regNo', getStudentByRegistration);

// Route to update a student by registration number
router.put('/students/:regNo', updateStudentByRegistration);

// Route to delete a student by registration number
router.delete('/students/:regNo', deleteStudentByRegistration);

module.exports = router;
