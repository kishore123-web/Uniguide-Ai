const mongoose = require('mongoose');
const CareerMapping = require('../models/CareerMapping');
const SkillRoadmap = require('../models/SkillRoadmap');
require('dotenv').config({ path: '../.env' }); // Load env variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tnea_colleges')
    .then(() => {
        console.log('MongoDB Connected for Seeding');
        seedData();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

const careers = [
    {
        domain: "Software Development",
        primary: "Computer Science Engineering",
        alternates: [
            { branchName: "Information Technology", similarityScore: 95, placementOverlapScore: 90 },
            { branchName: "Electronics & Communication", similarityScore: 70, placementOverlapScore: 80 },
            { branchName: "Artificial Intelligence & DS", similarityScore: 90, placementOverlapScore: 95 }
        ]
    },
    {
        domain: "Cyber Security",
        primary: "Cyber Security Engineering",
        alternates: [
            { branchName: "Information Technology", similarityScore: 85, placementOverlapScore: 85 },
            { branchName: "Computer Science Engineering", similarityScore: 80, placementOverlapScore: 80 },
            { branchName: "Electronics & Communication", similarityScore: 60, placementOverlapScore: 50 }
        ]
    },
    {
        domain: "AI / Data Science",
        primary: "Artificial Intelligence & Data Science",
        alternates: [
            { branchName: "Computer Science Engineering", similarityScore: 90, placementOverlapScore: 95 },
            { branchName: "Information Technology", similarityScore: 85, placementOverlapScore: 90 },
            { branchName: "Electronics & Comm (AI Specialization)", similarityScore: 75, placementOverlapScore: 80 }
        ]
    },
    {
        domain: "Core Mechanical",
        primary: "Mechanical Engineering",
        alternates: [
            { branchName: "Automobile Engineering", similarityScore: 85, placementOverlapScore: 80 },
            { branchName: "Production Engineering", similarityScore: 80, placementOverlapScore: 75 },
            { branchName: "Mechatronics", similarityScore: 70, placementOverlapScore: 65 }
        ]
    },
    {
        domain: "Civil Engineering",
        primary: "Civil Engineering",
        alternates: [
            { branchName: "Geo Informatics", similarityScore: 75, placementOverlapScore: 60 },
            { branchName: "Environmental Engineering", similarityScore: 80, placementOverlapScore: 50 }
        ]
    },
    {
        domain: "Electronics / Embedded Systems",
        primary: "Electronics & Communication Engg",
        alternates: [
            { branchName: "Electrical & Electronics Engg", similarityScore: 85, placementOverlapScore: 85 },
            { branchName: "Instrumentation & Control", similarityScore: 80, placementOverlapScore: 75 },
            { branchName: "Mechatronics", similarityScore: 70, placementOverlapScore: 70 }
        ]
    }
];

const roadmaps = [
    {
        domain: "Software Development",
        years: [
            { year: 1, skills: ["C++ / Python Basics", "Problem Solving", "Git & GitHub"], certs: ["CS50", "Python for Everybody"], projects: ["Calculator", "To-Do List"] },
            { year: 2, skills: ["Data Structures & Algorithms", "Web Development Basics (HTML/CSS/JS)", "Database Basics"], certs: ["FreeCodeCamp Web Design", "HackerRank Problem Solving"], projects: ["Portfolio Website", "Simple Game"] },
            { year: 3, skills: ["MERN Stack / Full Stack", "System Design Basics", "Cloud Basics (AWS/Firebase)"], certs: ["AWS Practitioner", "Full Stack Bootcamp"], projects: ["E-commerce App", "Social Media Clone"] },
            { year: 4, skills: ["Advanced DSA (Graphs/DP)", "Interview Prep", "Open Source Contribution"], certs: [], projects: ["Capstone Project", "Real-world SaaS"] }
        ]
    },
    {
        domain: "AI / Data Science",
        years: [
            { year: 1, skills: ["Python", "Statistics & Probability", "Linear Algebra"], certs: ["Python for Data Science (IBM)"], projects: ["Data Analysis on Excel/Pandas"] },
            { year: 2, skills: ["Machine Learning Basics", "Data Visualization", "SQL"], certs: ["Andrew Ng ML Course"], projects: ["House Price Prediction", "Titanic Survival Analysis"] },
            { year: 3, skills: ["Deep Learning", "NLP / Computer Vision", "Big Data Tools"], certs: ["DeepLearning.AI Specialization"], projects: ["Image Classifier", "Chatbot"] },
            { year: 4, skills: ["MLOps", "Model Deployment", "Research Paper implementation"], certs: ["TensorFlow Developer"], projects: ["End-to-End ML Pipeline"] }
        ]
    },
    {
        domain: "Core Mechanical",
        years: [
            { year: 1, skills: ["Engineering Drawing", "AutoCAD", "Physics Mechanics"], certs: ["AutoCAD Associates"], projects: ["3D Modelling Basic Parts"] },
            { year: 2, skills: ["Thermodynamics", "SolidWorks / Catia", "Matlab Basics"], certs: ["SolidWorks CSWA"], projects: ["Gearbox Design", "Mechanism Simulation"] },
            { year: 3, skills: ["FEA / ANSYS", "Manufacturing Processes", "GD&T"], certs: ["ANSYS Associate"], projects: ["Structural Analysis of Chassis"] },
            { year: 4, skills: ["CFD", "Product Design Lifecycle", "Robotics Basics"], certs: [], projects: ["Electric Vehicle Prototype"] }
        ]
    }
    // Add more if needed, but this covers the core examples
];

const seedData = async () => {
    try {
        await CareerMapping.deleteMany({});
        await SkillRoadmap.deleteMany({});

        console.log('Cleared existing data...');

        for (const career of careers) {
            await new CareerMapping({
                careerDomain: career.domain,
                primaryBranch: career.primary,
                alternateBranches: career.alternates
            }).save();
        }

        for (const map of roadmaps) {
            for (const y of map.years) {
                await new SkillRoadmap({
                    careerDomain: map.domain,
                    year: y.year,
                    recommendedSkills: y.skills,
                    certifications: y.certs,
                    projectTypes: y.projects
                }).save();
            }
        }

        console.log('Seeding Completed Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};
