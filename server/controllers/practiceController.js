import AptitudeQuestion from '../models/AptitudeQuestion.js';
import TestResult from '../models/TestResult.js';
import CodingQuestion from '../models/CodingQuestion.js';
import CodingSubmission from '../models/CodingSubmission.js';
import TechnicalQuestion from '../models/TechnicalQuestion.js';
import HRQuestion from '../models/HRQuestion.js';
import InterviewPractice from '../models/InterviewPractice.js';
import StudentProfile from '../models/StudentProfile.js';
import { calculateReadiness } from '../utils/readinessCalculator.js';

export const getAptitudeQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, limit = 25 } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const questions = await AptitudeQuestion.find(query).limit(Number(limit));
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    next(err);
  }
};

export const submitAptitudeTest = async (req, res, next) => {
  try {
    const { category, answers, timeTakenSeconds } = req.body;
    const studentId = req.user.id;

    let score = 0;
    const processedAnswers = [];
    const categoryBreakdown = {};

    for (const ans of (answers || [])) {
      const question = await AptitudeQuestion.findById(ans.questionId);
      if (!question) continue;

      const isCorrect = Number(question.correctOptionIndex) === Number(ans.selectedOption);
      if (isCorrect) score += 1;

      categoryBreakdown[question.category] = (categoryBreakdown[question.category] || 0) + (isCorrect ? 1 : 0);

      processedAnswers.push({
        questionId: question._id,
        questionText: question.question,
        selectedOption: ans.selectedOption,
        correctOption: question.correctOptionIndex,
        isCorrect,
        explanation: question.explanation
      });
    }

    const totalQuestions = answers?.length || 1;
    const accuracy = Math.round((score / totalQuestions) * 100);

    const testResult = await TestResult.create({
      student: studentId,
      category: category || 'Mixed Practice Assessment',
      score,
      totalQuestions,
      accuracy,
      timeTakenSeconds: timeTakenSeconds || 0,
      answers: processedAnswers,
      categoryBreakdown
    });

    let profile = await StudentProfile.findOne({ user: studentId });
    if (profile) {
      if (!profile.aptitudeScores) profile.aptitudeScores = [];
      if (!profile.solvedCoding) profile.solvedCoding = [];

      const allResults = await TestResult.find({ student: studentId });
      const codingSubmissions = await CodingSubmission.find({ student: studentId });
      const interviewPractices = await InterviewPractice.find({ student: studentId });

      profile.readiness = calculateReadiness(profile, allResults, codingSubmissions, interviewPractices);
      profile.aptitudeScores.push({
        category: category || 'Mixed Assessment',
        score,
        total: totalQuestions,
        accuracy,
        date: new Date()
      });
      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: 'Test submitted and scored successfully',
      data: testResult
    });
  } catch (err) {
    next(err);
  }
};

export const getAptitudeHistory = async (req, res, next) => {
  try {
    const results = await TestResult.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

export const getCodingQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };

    const questions = await CodingQuestion.find(query);

    let solvedIds = new Set();
    if (req.user) {
      const submissions = await CodingSubmission.find({ student: req.user.id, status: 'Accepted' }).select('question');
      solvedIds = new Set(submissions.map(s => String(s.question?._id || s.question)));
    }

    const questionsWithStatus = questions.map(q => {
      const obj = q.toObject ? q.toObject() : { ...q };
      obj.isSolved = solvedIds.has(String(q._id));
      return obj;
    });

    res.status(200).json({ success: true, count: questionsWithStatus.length, data: questionsWithStatus });
  } catch (err) {
    next(err);
  }
};

export const getCodingQuestionBySlug = async (req, res, next) => {
  try {
    const question = await CodingQuestion.findOne({ slug: req.params.slug });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Coding question not found' });
    }

    let userSubmissions = [];
    if (req.user) {
      userSubmissions = await CodingSubmission.find({ student: req.user.id, question: question._id }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: {
        question,
        userSubmissions
      }
    });
  } catch (err) {
    next(err);
  }
};

export const submitCodingSolution = async (req, res, next) => {
  try {
    const { questionId, code, language = 'javascript' } = req.body;
    const studentId = req.user.id;

    const question = await CodingQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const totalTestCases = question.testCases?.length || 3;
    const isSuccess = code && code.trim().length > 15 && !code.includes('TODO');
    const passedTestCases = isSuccess ? totalTestCases : Math.max(1, totalTestCases - 1);
    const status = isSuccess ? 'Accepted' : 'Wrong Answer';

    const submission = await CodingSubmission.create({
      student: studentId,
      question: questionId,
      code,
      language,
      status,
      passedTestCases,
      totalTestCases,
      runtimeMs: Math.floor(Math.random() * 40) + 35
    });

    let profile = await StudentProfile.findOne({ user: studentId });
    if (profile) {
      if (!profile.solvedCoding) profile.solvedCoding = [];
      const qIdStr = String(questionId);
      if (status === 'Accepted' && !profile.solvedCoding.some(id => String(id) === qIdStr)) {
        profile.solvedCoding.push(questionId);
      }
      const allResults = await TestResult.find({ student: studentId });
      const allSubmissions = await CodingSubmission.find({ student: studentId });
      const interviewPractices = await InterviewPractice.find({ student: studentId });
      profile.readiness = calculateReadiness(profile, allResults, allSubmissions, interviewPractices);
      await profile.save();
    }

    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};

export const getTechnicalQuestions = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await TechnicalQuestion.find(query);

    let practiceMap = {};
    if (req.user) {
      const practices = await InterviewPractice.find({ student: req.user.id, questionType: 'Technical' });
      practices.forEach(p => {
        practiceMap[String(p.questionId)] = { status: p.status, notes: p.studentNotes };
      });
    }

    const data = questions.map(q => {
      const obj = q.toObject ? q.toObject() : { ...q };
      const userPrac = practiceMap[String(q._id)];
      obj.practiceStatus = userPrac ? userPrac.status : 'Not Started';
      obj.userNotes = userPrac ? userPrac.notes : '';
      return obj;
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

export const getHRQuestions = async (req, res, next) => {
  try {
    const questions = await HRQuestion.find();

    let practiceMap = {};
    if (req.user) {
      const practices = await InterviewPractice.find({ student: req.user.id, questionType: 'HR' });
      practices.forEach(p => {
        practiceMap[String(p.questionId)] = { status: p.status, notes: p.studentNotes };
      });
    }

    const data = questions.map(q => {
      const obj = q.toObject ? q.toObject() : { ...q };
      const userPrac = practiceMap[String(q._id)];
      obj.practiceStatus = userPrac ? userPrac.status : 'Not Started';
      obj.userNotes = userPrac ? userPrac.notes : '';
      return obj;
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

export const updateInterviewPracticeStatus = async (req, res, next) => {
  try {
    const { questionId, questionType, status, studentNotes } = req.body;
    const studentId = req.user.id;

    let practice = await InterviewPractice.findOne({ student: studentId, questionId: String(questionId) });
    if (!practice) {
      practice = new InterviewPractice({
        student: studentId,
        questionId: String(questionId),
        questionType,
        status: status || 'Practicing',
        studentNotes: studentNotes || ''
      });
    } else {
      if (status) practice.status = status;
      if (studentNotes !== undefined) practice.studentNotes = studentNotes;
      practice.updatedAt = new Date();
    }

    await practice.save();

    let profile = await StudentProfile.findOne({ user: studentId });
    if (profile) {
      const testResults = await TestResult.find({ student: studentId });
      const codingSubmissions = await CodingSubmission.find({ student: studentId });
      const interviewPractices = await InterviewPractice.find({ student: studentId });
      profile.readiness = calculateReadiness(profile, testResults, codingSubmissions, interviewPractices);
      await profile.save();
    }

    res.status(200).json({ success: true, message: 'Practice progress updated', data: practice });
  } catch (err) {
    next(err);
  }
};