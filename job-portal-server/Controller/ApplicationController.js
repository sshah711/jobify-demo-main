const ApplicationModel = require("../Model/ApplicationModel");
const mongoose = require("mongoose");
const createError = require("http-errors");
const UserModel = require("../Model/UserModel");
const JobModel = require("../Model/JobModel");
const day = require("dayjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sshah380008@gmail.com", // Your Gmail email address
    pass: "emsj uhne kpov xdok", // Your Gmail password
  },
});
exports.getAllInfo = async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    const recruiter = await UserModel.find({ role: "recruiter" });
    const applicant = await UserModel.find({ role: "user" });
    const u = await UserModel.findById({ _id: req.body.applicantId });
    const jobs = await JobModel.find({});

    const interviewJobs = await JobModel.find({ jobStatus: "interview" });
    const pendingJobs = await JobModel.find({ jobStatus: "pending" });
    const declinedJobs = await JobModel.find({ jobStatus: "declined" });
    console.log(applicant);
    res.status(200).json({
      user: u?.length || 0,
      recruiter: recruiter?.length || 0,
      applicant: applicant?.length || 0,
      job: jobs?.length || 0,
      interview: interviewJobs?.length || 0,
      pending: pendingJobs?.length || 0,
      declined: declinedJobs?.length || 0,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
exports.testing = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Ok",
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.getCandidateAppliedJobs = async (req, res, next) => {
  try {
    const filters = { ...req.query, applicantId: req.user._id }; // to make a copy so that original don't moidfied
    console.log(filters);
    // exclude
    const excludeFields = ["sort", "page", "limit", "fields", "search"];
    excludeFields.forEach((field) => delete filters[field]);

    const queries = {};

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
    }
    if (req.query.limit) {
      const limit = req.query.limit.split(",").join(" ");
      queries.limit = limit;
    }

    if (req.query.page) {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 5);
      const skip = (page - 1) * limit;

      queries.skip = skip;
      queries.limit = limit;
      queries.page = page;
    }

    const { result, totalJobs, pageCount, page } = await getData(
      filters,
      queries
    );

    // response
    if (result.length !== 0) {
      res.status(200).json({
        status: true,
        result,
        totalJobs,
        currentPage: page,
        pageCount: pageCount || 1,
      });
    } else {
      next(createError(500, "Job List is empty"));
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getData = async (filters, queries) => {
  let sortCriteria = {};

  if (queries.sortBy) {
    switch (queries.sortBy) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "a-z":
        sortCriteria = { position: 1 };
        break;
      case "z-a":
        sortCriteria = { position: -1 };
        break;
      default:
        // Default sorting criteria if none of the options match
        sortCriteria = { createdAt: -1 };
        break;
    }
  } else {
    // Default sorting criteria if sortBy parameter is not provided
    sortCriteria = { createdAt: -1 };
  }
  const result = await ApplicationModel.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .sort(sortCriteria)
    .select(queries.fields)
    .populate("jobId");

  // it not depend on previous one, its document number will be based on filter passing here
  const totalJobs = await ApplicationModel.countDocuments(filters);
  const pageCount = Math.ceil(totalJobs / queries.limit);
  return { result, totalJobs, pageCount, page: queries.page };
};

module.exports.getRecruiterPostJobs = async (req, res, next) => {
  const filter = { recruiterId: req.user._id };
  try {
    const result = await ApplicationModel.find(filter).populate("jobId");
    const totalJobs = await ApplicationModel.countDocuments(filter);
    // response

    if (result.length !== 0) {
      console.log(result);
      res.status(200).json({
        status: true,
        totalJobs,
        result,
      });
    } else {
      next(createError(500, "No Job Found"));
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

exports.applyInJob = async (req, res, next) => {
  try {
    const alreadyApplied = await ApplicationModel.findOne({
      applicantId: req.body.applicantId,
      jobId: req.body.jobId,
    });

    const user = await UserModel.findById({ _id: req.body.applicantId });
    const job = await JobModel.findById({ _id: req.body.jobId });
    const s =  job.company
    const p =  job.position
    console.log(job.company)
     console.log(p)
    //const email = user.email;
    const rec = await UserModel.findById({ _id: req.body.recruiterId });
    if (alreadyApplied) {
      next(createError(500, "Already Applied"));
    } else {
      const j = await JobModel.findById(req.body.jobId);
      let c = j.cnt + 1;
      j.cnt = c;
      j.save();
      // const company = j.company;
      const applied = new ApplicationModel(req.body);
      const result = await applied.save();

      const mailOptions1 = {
        from: "sshah380008@gmail.com",
        to: user.email,
        subject: "Registered",
        text: `You have successfully Applied to ${s} for ${p} position.`,
      };
      transporter.sendMail(mailOptions1, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).send("Failed to send OTP.");
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send("OTP sent successfully.");
        }
      });

      const mailOptions2 = {
        from: "sshah380008@gmail.com",
        to: rec.email,
        subject: "New Applicant Added.",
        text: `one applicant are added in ${s} for ${p} position.`,
      };
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).send("Failed to send OTP.");
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send("OTP sent successfully.");
        }
      });

      res.status(201).json({
        status: true,
        message: "Applied Successfully",
      });
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.updateJobStatus = async (req, res, next) => {
  const { id } = req.params;
  const data = await req.body;
  const sts= data.status

  console.log(sts)
  try {
    if (data?.recruiterId?.toString() === req?.user._id.toString()) {
      console.log("same");
      if (!mongoose.Types.ObjectId.isValid(id)) {
        next(createError(400, "Invalid Job ID format"));
      }

        
      const isJobExists = await ApplicationModel.findOne({ _id: id });
      if (!isJobExists) {
        next(createError(500, "Job not found"));
      } else {


        const updatedJob = await ApplicationModel.findByIdAndUpdate(
          id,
          { $set: data },
          {
            new: true,
          }
        );
          const ss=isJobExists.applicantId
          // console.log(isJobExists)
          // console.log(ss)
        const user = await UserModel.findById({ _id: ss });
        const email = user.email;
        
        const mailOptions = {
            from: "sshah380008@gmail.com",
            to: email,
            subject: "Job Status",
            text: `You are ${sts} to this job.`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.status(500).send("Failed to send OTP.");
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).send("OTP sent successfully.");
            }
          });
        res.status(200).json({
          status: true,
          message: "Job Updated",
          result: updatedJob,
        });
      }
    } else {
      next(createError(400, "Unauthorized user to update job"));
    }
  } catch (error) {
    next(createError(500, `something wrong: ${error.message}`));
  }
};
