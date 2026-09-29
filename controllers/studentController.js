const Student = require("../models/Student");
const getStudents = async(req, res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1)*limit;
        const students = await Student.find()
            .skip(skip)
            .limit(limit);
        const totalStudents = await Student.countDocuments();
        const totalPages = Math.ceil(totalStudents/limit);
        res.json({
            students,
            currentPage: page,
            totalPages,
            totalStudents
        });
    } catch(error){
        res.status(500).json({
            message:"Failed to fetch students"
        });
    }
};

const getStudentById = async(req, res) =>{
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        res.json(student);
    } catch(error){
        res.status(400).json({
            message:"Invalid student ID"
        });
    }
};

const createStudent = async(req, res) =>{
    try{
        const {name, age, course} = req.body;
        if(!name || !age || !course){
            return res.status(400).json({
                message:"Name, age and course are required"
            });
        }
        const student = await Student.create({
            name,
            age,
            course
        });
        res.status(201).json(student);
    } catch(error){
        res.status(500).json({
            message:"Failed to create student"
        });
    }
};

const updateStudent = async(req, res) =>{
    try{
        const {name, age, course} = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {name, age, course},
            {new:true}
        )
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        res.json(student);
    } catch(error){
        res.status(400).json({
            message:"Invalid student ID"
        });
    }
};

const deleteStudent = async(req, res) =>{
    try{
        const student = await Student.findByIdAndDelete(req.params.id);
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        res.json({
            message:"Student deleted successfully"
        });
    } catch(error){
        res.status(400).json({
            message:"Invalid student ID"
        });
    }
};

const getTotalStudents = async(req, res) =>{
    try{
        const result = await Student.aggregate([
            {
                $count:"totalStudents"
            }
        ]);
        res.json(result);
    } catch(error){
        res.status(500).json({
            message:"Failed to count students"
        });
    }
};

const getStudentsByCourse = async(req,res) =>{
    try{
        const result = await Student.aggregate([
            {
                $group:{
                    _id:"$course",
                    totalStudents:{$sum:1}
                }
            }
        ]);
        res.json(result);
    } catch(error){
        res.status(500).json({
            message:"Failed to get students by course"
        });

    }
};

const getAverageAgeByCourse = async(req, res) =>{
    try {
        const result = await Student.aggregate([
            {
                $group:{
                    _id:"$course",
                    averageAge:{$avg:"$age"}
                }
            }
        ]);
        res.json(result);
    } catch(error){
        res.status(500).json({
            message:"Failed to calculate average age"
        });
    }
};

module.exports ={
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getTotalStudents,
    getStudentsByCourse,
    getAverageAgeByCourse
};