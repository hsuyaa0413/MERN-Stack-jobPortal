const Job = require("../models/jobModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/appError")

exports.postJob = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    positions,
    experienceLevel,
    companyId,
  } = req.body

  const userId = req.user.id

  const newJob = await Job.create({
    title,
    description,
    requirements: requirements.split(","),
    salary: Number(salary),
    location,
    jobType,
    positions,
    experienceLevel,
    companyId,
    createdBy: userId,
  })

  res.status(201).json({
    status: "success",
    message: "New job created!",
    data: {
      newJob,
    },
  })
})

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword || ""

  const query = {
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  }

  const jobs = await Job.find(query)
  if (!jobs) return next(new AppError("No such jobs found!", 400))

  res.status(200).json({
    status: "success",
    data: {
      jobs,
    },
  })
})

exports.getJobById = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId

  const job = await Job.findById(jobId)
  if (!job) return next(new AppError("No such job found!", 404))

  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  })
})

exports.getJobsByUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id

  const jobs = await Job.find({ createdBy: userId })
  if (!jobs) return next(new AppError("No jobs posted by this user!", 404))

  res.status(200).json({
    status: "success",
    data: {
      jobs,
    },
  })
})