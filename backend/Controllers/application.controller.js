const Application = require("../Models/Application");
const User = require('../Models/User');
const Request = require("../Models/Request");
const {createApplicationSchema, updateApplicationSchema} = require("../Validations/application.validation");
const notificationService = require("../Utils/notificationService.js");
const {evaluateBadges} = require("../Utils/BadgeEngine.js");

const applyForTask = async (req, res, next) => {
    try {
        const {error, value} = createApplicationSchema.validate(req.body, {abortEarly: false, stripUnknown: true});

        if(error) return res.status(400).json({
            message: "Validation failed",
            errors: error.details.map((e)=>e.message)
        });

        const request = await Request.findById(value.requestId);

        if(!request) return res.status(404).json({message: "Request not found"});
        
        if(req.user.id === request.requesterId.toString()) return res.status(403).json({message: "You are not allowed to submit to your own request"});

        if (request.volunteersFilled >= request.volunteersNeeded)
            return res.status(400).json({message: "This request has reached it's maximum volunteers"});

        const existingApplication = await Application.findOne({
            requestId: value.requestId,
            volunteerId: req.user.id
        });

        if(existingApplication) res.status(400).json({message: "You have already applied for this task"});

        const application = await Application.create({
            requestId: request._id,
            volunteerId: req.user.id    
        });

        return res.status(201).json({
            success: true,
            message: "Application is creatd successfully",
            data: application
        });
    } catch(error) {
        next(error);
    }
};

const acceptApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id).populate("requestId");

        if(!application) return res.status(404).json({message: "Application not found"});

        if(req.user.id !== application.requestId.requesterId.toString()) return res.status(403).json({message: "You are not allowed to take action on someone else's request"});

        if(application.status !== "pending") return res.status(400).json({message: "This application has already been processed"});

        if (application.requestId.volunteersFilled >= application.requestId.volunteersNeeded) return res.status(400).json({message: "This request has reached it's maximum volunteers"});

        const asignedApplication = await Application.findByIdAndUpdate(
            application._id,
            {status: "accepted"},
            {new: true}
        );

        await Request.findByIdAndUpdate(application.requestId._id, {
            $inc: {volunteersFilled: 1}
        });

        return res.status(200).json({
            success: true,
            message: "Volunteer accepted successfully",
            data: asignedApplication
        });
    } catch(error){
        next(error);
    }
};

const getApplicantsByRequest = async (req, res, next) => {
    try{
        const requestId = req.params.id;
        const request = await Request.findById(requestId);

        if(!request) return res.status(404).json({message: "Request not found"});

        if(req.user.id !== request.requesterId.toString()) return res.status(403).json({message: "You are not allowed to access this request info"});

        const volunteers = await Application.find({requestId})
        .populate("volunteerId", "name avatar trustScore hiveRating")
        .lean();

        return res.status(200).json({
            success: true,
            message: "Got all volunteers",
            count: volunteers.length,
            data: volunteers
        });

    }catch(error){
        next(error);
    }
};

const startTask = async (req, res, next) => {
    try{
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);

        if(!application) return res.status(404).json({message: "Application not found"});

        if(req.user.id !== application.volunteerId.toString()) return res.status(403).json({message: "Only the assigned volunteer can start this task"});

        if(application.status !== "accepted") return res.status(400).json({message: "You must be accepted before starting the task"});

        if(application.missionStatus !== "pending") return res.status(400).json({message: "Task is already in progress or completed"});

        application.missionStatus = "in_progress";
        application.startedAt = Date.now();

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Mission started! Good luck, hero.",
            data: application
        });
    }catch(error){
        next(error);
    }
};

const completeTask = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id).populate("requestId");

        if(!application) return res.status(404).json({message: "Application not found"});

        if(req.user.id !== application.volunteerId.toString())
            return res.status(403).json({message: "You are not assigned to this request"});

        if(application.missionStatus !== "in_progress") 
            return res.status(400).json({message: "Request is not in progress"});

        application.missionStatus = "completed";
        application.requestId.status = "closed";
        application.completedAt = Date.now();
        application.honeyAwarded = true;
        await application.requestId.save();
        await application.save();

        await notificationService.notifyUser(
            application.volunteerId,
            "task_completed",
            "Mission Accomplished",
            `You earned ${application.requestId.honeyReward} Honey drops from completing "${application.requestId.title}"`,
            application.requestId._id
        );

        await notificationService.notifyUser(
            application.requestId.requesterId,
            "task_completed",
            "Task Completed!",
            `The volunteer has finished the task: "${application.requestId.title}". Please leave a review.`,
            application.requestId._id
        );

        await User.findByIdAndUpdate(
            application.volunteerId,
            {$inc: {
                honeyCollected: application.requestId.honeyReward,
                tasksCompleted: 1
            }},
            {new: true}
        );

        await evaluateBadges(application.volunteerId);

        return res.status(200).json({
            success: true,
            message: "Congratulations on completing your request! Honey drops awarded.",
            data: application
        });

    } catch(error) {
        next(error);
    }
};

module.exports = { applyForTask, acceptApplication, getApplicantsByRequest, startTask, completeTask };