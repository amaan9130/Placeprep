import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import AptitudeQuestion from '../models/AptitudeQuestion.js';
import CodingQuestion from '../models/CodingQuestion.js';
import TechnicalQuestion from '../models/TechnicalQuestion.js';
import HRQuestion from '../models/HRQuestion.js';
import Notification from '../models/Notification.js';
import Announcement from '../models/Announcement.js';

import { companiesData } from './seedCompanies.js';
import { aptitudeQuestionsData, codingQuestionsData, technicalQuestionsData, hrQuestionsData } from './seedQuestions.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding PlacePrep database with fresh isolated data...');

    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      PlacementDrive.deleteMany({}),
      AptitudeQuestion.deleteMany({}),
      CodingQuestion.deleteMany({}),
      TechnicalQuestion.deleteMany({}),
      HRQuestion.deleteMany({}),
      Notification.deleteMany({}),
      Announcement.deleteMany({})
    ]);

    // 1. Companies
    const companies = await Company.insertMany(companiesData);
    const companyMap = {};
    companies.forEach(c => { companyMap[c.name] = c; });

    // 2. Demo Users & Admins (Pass plain text so pre-save hook hashes them exactly once)
    const demoStudentUser = await User.create({
      name: 'Aditya Sharma',
      email: 'student@placeprep.edu',
      password: 'student123',
      role: 'student',
      college: 'Institute of Engineering & Technology',
      department: 'Computer Science & Engineering',
      graduationYear: 2026,
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
    });

    const demoAdminUser = await User.create({
      name: 'Dr. Rajesh Verma',
      email: 'admin@placeprep.edu',
      password: 'admin123',
      role: 'admin',
      college: 'Institute of Engineering & Technology',
      department: 'Training & Placement Cell',
      phone: '+91 99887 76655',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    });

    const demoRecruiterUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@google.com',
      password: 'recruiter123',
      role: 'recruiter',
      companyName: 'Google',
      companyWebsite: 'https://careers.google.com',
      companyRef: companyMap['Google']._id,
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
    });

    // 3. Demo Student Profile
    const demoProfile = await StudentProfile.create({
      user: demoStudentUser._id,
      rollNumber: '22BCSE042',
      cgpa: 8.65,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      branch: 'Computer Science & Engineering',
      tenthPercentage: 92.5,
      twelfthPercentage: 89.0,
      gender: 'Male',
      bio: 'Pre-final year CSE student passionate about distributed systems, MERN full-stack development, and algorithmic optimization.',
      location: 'Bengaluru, India',
      skills: [
        { name: 'Data Structures & Algorithms', level: 'Advanced' },
        { name: 'JavaScript / TypeScript', level: 'Advanced' },
        { name: 'React.js', level: 'Advanced' },
        { name: 'Node.js & Express', level: 'Intermediate' },
        { name: 'MongoDB & PostgreSQL', level: 'Intermediate' },
        { name: 'Java', level: 'Intermediate' },
        { name: 'Git & Docker', level: 'Intermediate' }
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'Institute of Engineering & Technology',
          fieldOfStudy: 'Computer Science',
          startYear: 2022,
          endYear: 2026,
          grade: '8.65 CGPA'
        }
      ],
      projects: [
        {
          title: 'PlacePrep - Placement Portal',
          description: 'A full-stack recruitment & placement prep management ecosystem featuring mock assessments and candidate tracking.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
          githubUrl: 'https://github.com/adityasharma/placeprep',
          liveUrl: 'https://placeprep.dev'
        },
        {
          title: 'Algorithmic Trading Backtester',
          description: 'High-speed event-driven engine in Node.js for simulating algorithmic trading strategies.',
          technologies: ['Node.js', 'WebSockets', 'Chart.js'],
          githubUrl: 'https://github.com/adityasharma/algo-backtest',
          liveUrl: ''
        }
      ],
      experience: [
        {
          title: 'Software Engineering Intern',
          company: 'FinTech Innovations Lab',
          location: 'Bengaluru (Remote)',
          startDate: 'May 2025',
          endDate: 'July 2025',
          current: false,
          description: 'Engineered RESTful microservices for payment reconciliation and reduced API response latency by 32%.'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueDate: 'Jan 2025',
          credentialUrl: 'https://aws.amazon.com/verification'
        }
      ],
      achievements: [
        'Solved 250+ DSA problems on LeetCode with a contest rating of 1720.',
        'Top 10 Finalist at National Smart India Hackathon 2024.'
      ],
      resumeData: {
        summary: 'Proactive and results-driven Computer Science student with solid foundations in Data Structures, Algorithms, and full-stack web engineering.'
      },
      readiness: {
        overall: 81,
        aptitude: 82,
        coding: 78,
        technical: 84,
        interview: 70,
        resume: 92,
        profileCompletion: 95,
        recommendations: [
          'Practice HR behavioral questions using the STAR framework to raise interview readiness above 80%.',
          'Solve 5 medium-level Dynamic Programming questions this week.'
        ]
      },
      placementStatus: 'Not Placed'
    });

    // 4. Job Openings
    const jobsData = [
      {
        title: 'Software Development Engineer I (SDE-1)',
        company: companyMap['Google']._id,
        recruiter: demoRecruiterUser._id,
        description: 'Join Google core engineering teams building products used by billions of users worldwide. Design, build, and optimize distributed cloud services.',
        responsibilities: [
          'Design, develop, test, deploy, maintain, and improve software.',
          'Manage individual project priorities, deadlines, and deliverables.'
        ],
        skillsRequired: ['Data Structures', 'Algorithms', 'Java', 'C++', 'Distributed Systems', 'Python'],
        jobType: 'Full-time',
        location: 'Bengaluru / Hybrid',
        package: {
          ctc: 45.0,
          formatted: '45.0 LPA',
          stipend: '₹1,25,000 / month',
          breakdown: 'Base: 24 LPA + Stock Units: 16 LPA + Joining Bonus: 5 LPA'
        },
        eligibility: {
          minCgpa: 8.0,
          maxBacklogs: 0,
          allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
          allowedGraduationYears: [2026]
        },
        vacancies: 8,
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        rounds: ['Online Aptitude & Coding Round', 'Technical Interview 1 (DSA)', 'Technical Interview 2', 'Leadership Round'],
        status: 'Open'
      },
      {
        title: 'Software Engineer - Cloud & AI',
        company: companyMap['Microsoft']._id,
        description: 'Work on Azure cloud services and modern AI infrastructure. Build secure, high-scale microservices.',
        responsibilities: [
          'Develop cloud-native backend services on Azure.',
          'Collaborate across teams to deliver enterprise features.'
        ],
        skillsRequired: ['C#', 'Java', 'Data Structures', 'Azure', 'System Design'],
        jobType: 'Full-time',
        location: 'Hyderabad / Bengaluru',
        package: {
          ctc: 42.5,
          formatted: '42.5 LPA',
          stipend: '₹1,00,000 / month',
          breakdown: 'Base: 22 LPA + Stocks: 15.5 LPA + Performance Bonus: 5 LPA'
        },
        eligibility: {
          minCgpa: 7.5,
          maxBacklogs: 0,
          allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering'],
          allowedGraduationYears: [2026]
        },
        vacancies: 12,
        applicationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        driveDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        rounds: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'Director Round'],
        status: 'Open'
      },
      {
        title: 'Software Development Engineer - AWS',
        company: companyMap['Amazon']._id,
        description: 'Amazon is hiring SDEs to solve complex computer science problems in high-availability distributed storage and cloud services.',
        responsibilities: [
          'Write high-quality, maintainable, and robust code.',
          'Participate in architecture reviews and on-call operational excellence.'
        ],
        skillsRequired: ['Java', 'Object Oriented Design', 'Data Structures', 'Algorithms', 'AWS'],
        jobType: 'Full-time',
        location: 'Bengaluru / Chennai',
        package: {
          ctc: 38.0,
          formatted: '38.0 LPA',
          stipend: '₹80,000 / month',
          breakdown: 'Base: 18 LPA + Sign-on 1st Yr: 9.5 LPA + RSUs: 10.5 LPA'
        },
        eligibility: {
          minCgpa: 7.0,
          maxBacklogs: 0,
          allowedBranches: ['All Branches'],
          allowedGraduationYears: [2026]
        },
        vacancies: 15,
        applicationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        rounds: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'Bar Raiser Round'],
        status: 'Open'
      },
      {
        title: 'Associate Consultant - Tech Advisory',
        company: companyMap['Deloitte']._id,
        description: 'Deliver strategic technology transformations for Fortune 500 clients in cloud migration and analytics.',
        responsibilities: ['Design technology roadmaps and architectural prototypes.'],
        skillsRequired: ['Python', 'SQL', 'React', 'Cloud Concepts'],
        jobType: 'Full-time',
        location: 'Hyderabad / Mumbai',
        package: {
          ctc: 15.0,
          formatted: '15.0 LPA',
          stipend: '₹40,000 / month',
          breakdown: 'Base: 13.5 LPA + Performance Bonus: 1.5 LPA'
        },
        eligibility: {
          minCgpa: 7.0,
          maxBacklogs: 0,
          allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
          allowedGraduationYears: [2026]
        },
        vacancies: 20,
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'Open'
      }
    ];

    const jobs = await Job.insertMany(jobsData);

    // 5. Sample Applications for Demo Student
    await Application.create([
      {
        job: jobs[0]._id, // Google
        student: demoStudentUser._id,
        studentProfile: demoProfile._id,
        status: 'Technical Interview',
        timeline: [
          { stage: 'Applied', status: 'Applied', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), notes: 'Application submitted successfully.' },
          { stage: 'Shortlisted', status: 'Shortlisted', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), notes: 'Profile shortlisted based on CGPA and coding assessment.' },
          { stage: 'Aptitude Test', status: 'Aptitude Test', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'Scored 92% in Online Assessment.' },
          { stage: 'Technical Interview', status: 'Technical Interview', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Technical Round 1 scheduled.' }
        ],
        interviewSchedule: {
          stage: 'Technical Interview Round 1',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          time: '11:00 AM IST',
          meetingLink: 'https://meet.google.com/xyz-prep-test',
          instructions: 'Focus on Data Structures, Graphs, and Dynamic Programming. Please have an IDE ready.'
        }
      },
      {
        job: jobs[1]._id, // Microsoft
        student: demoStudentUser._id,
        studentProfile: demoProfile._id,
        status: 'Shortlisted',
        timeline: [
          { stage: 'Applied', status: 'Applied', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), notes: 'Application submitted.' },
          { stage: 'Shortlisted', status: 'Shortlisted', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), notes: 'Resume verified by Microsoft talent team.' }
        ]
      }
    ]);

    // 6. Placement Drives
    await PlacementDrive.create([
      {
        title: 'Google Campus Placement Drive 2026',
        company: companyMap['Google']._id,
        jobs: [jobs[0]._id],
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        venue: 'Main Auditorium & Virtual Lab 3',
        description: 'Annual on-campus recruitment drive for 2026 graduating B.Tech students.',
        eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
        status: 'Upcoming',
        coordinator: 'Prof. Rajesh Verma',
        instructions: ['Carry updated printed resume', 'College ID card mandatory']
      },
      {
        title: 'Microsoft Azure Engineering Drive',
        company: companyMap['Microsoft']._id,
        jobs: [jobs[1]._id],
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        venue: 'Virtual Teams & Computer Center 2',
        description: 'Hiring for Software Engineer roles across Cloud & AI divisions.',
        eligibleBranches: ['All Engineering Branches'],
        status: 'Upcoming',
        coordinator: 'Prof. Anita Sharma'
      }
    ]);

    // 7. Questions
    await AptitudeQuestion.insertMany(aptitudeQuestionsData);
    await CodingQuestion.insertMany(codingQuestionsData);
    await TechnicalQuestion.insertMany(technicalQuestionsData);
    await HRQuestion.insertMany(hrQuestionsData);

    // 8. Announcements & Notifications
    await Announcement.create([
      {
        title: 'Google & Microsoft Campus Drive Registrations Open',
        content: 'Eligible 2026 batch students with CGPA >= 7.5 and 0 active backlogs must verify their student profiles and register before Friday 5:00 PM.',
        author: demoAdminUser._id,
        priority: 'Urgent',
        targetRole: 'All'
      },
      {
        title: 'Weekly National Aptitude Mock Assessment #4',
        content: 'Live timed mock test focusing on Quantitative and Logical Reasoning will be available in the Aptitude Practice tab this Saturday at 10:00 AM.',
        author: demoAdminUser._id,
        priority: 'Normal',
        targetRole: 'student'
      }
    ]);

    await Notification.create([
      {
        recipient: demoStudentUser._id,
        title: 'Welcome to PlacePrep',
        message: 'Your campus placement prep portal account is active. Complete your profile and build your resume to get started.',
        type: 'System',
        link: '/student/profile'
      }
    ]);

    console.log('✅ PlacePrep database seeded successfully with exactly 3 users (Student, Recruiter, Admin)!');
  } catch (error) {
    console.error('❌ Error while seeding database:', error);
  }
};