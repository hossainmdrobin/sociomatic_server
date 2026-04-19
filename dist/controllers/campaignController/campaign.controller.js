"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignPosts = exports.getCampaignGenerationStatus = exports.generateCampaignPosts = exports.updateCampaignStats = exports.updateCampaignStatus = exports.deleteCampaign = exports.updateCampaign = exports.getCampaignsByUser = exports.getCampaignById = exports.getAllCampaigns = exports.createCampaign = void 0;
const campaign_model_1 = __importDefault(require("../../models/campaign.model"));
const post_model_1 = require("../../models/post.model");
const campaign_service_1 = __importDefault(require("../../services/campaign.service"));
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = new campaign_model_1.default(Object.assign(Object.assign({}, req.body), { user: req.user._id, institute: req.user.institute }));
        const savedCampaign = yield campaign.save();
        // const plan = await generatePlan(String(savedCampaign._id));
        yield campaign_service_1.default.startGeneration(String(savedCampaign._id));
        // const readyPlan = plan.map((p)=>({
        //     ...p,
        //     campaign: savedCampaign._id,
        //     admin: req.user._id,
        //     creator: req.user._id,
        //     institute: req.user.institute,
        //     account:savedCampaign.account,
        //     stage:"saved"
        // }))
        // await Post.insertMany(readyPlan);        
        res.status(201).json(savedCampaign);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error creating campaign", error });
    }
});
exports.createCampaign = createCampaign;
const getAllCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield campaign_model_1.default.find({ institute: req.user.institute }).populate("user").populate("products");
        res.status(200).json(campaigns);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching campaigns", error });
    }
});
exports.getAllCampaigns = getAllCampaigns;
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_model_1.default.findById(req.params.id)
            .populate("user")
            .populate("products");
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json(campaign);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching campaign", error });
    }
});
exports.getCampaignById = getCampaignById;
const getCampaignsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield campaign_model_1.default.find({ user: req.params.userId })
            .populate("user")
            .populate("products");
        res.status(200).json(campaigns);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user campaigns", error });
    }
});
exports.getCampaignsByUser = getCampaignsByUser;
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("user").populate("products");
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json(campaign);
    }
    catch (error) {
        res.status(400).json({ message: "Error updating campaign", error });
    }
});
exports.updateCampaign = updateCampaign;
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_model_1.default.findByIdAndDelete(req.params.id);
        yield post_model_1.Post.deleteMany({ campaign: req.params.id });
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json({ message: "Campaign deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting campaign", error });
    }
});
exports.deleteCampaign = deleteCampaign;
const updateCampaignStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const validStatuses = ["draft", "active", "completed", "paused"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        const campaign = yield campaign_model_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).populate("user").populate("products");
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json(campaign);
    }
    catch (error) {
        res.status(400).json({ message: "Error updating campaign status", error });
    }
});
exports.updateCampaignStatus = updateCampaignStatus;
const updateCampaignStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_model_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        campaign.stats = Object.assign(Object.assign({}, campaign.stats), req.body);
        yield campaign.save();
        res.status(200).json(campaign);
    }
    catch (error) {
        res.status(400).json({ message: "Error updating campaign stats", error });
    }
});
exports.updateCampaignStats = updateCampaignStats;
const generateCampaignPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: campaignId } = req.params;
        yield campaign_service_1.default.startGeneration(campaignId);
        res.status(202).json({
            success: true,
            message: "Post generation started",
            campaignId,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error starting generation", error });
    }
});
exports.generateCampaignPosts = generateCampaignPosts;
const getCampaignGenerationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: campaignId } = req.params;
        const status = yield campaign_service_1.default.getStatus(campaignId);
        res.json({
            success: true,
            data: status,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting status", error });
    }
});
exports.getCampaignGenerationStatus = getCampaignGenerationStatus;
const getCampaignPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: campaignId } = req.params;
        const { limit, skip } = req.query;
        const posts = yield campaign_service_1.default.getPosts(campaignId, {
            limit: limit ? parseInt(limit) : undefined,
            skip: skip ? parseInt(skip) : undefined,
        });
        res.json({
            success: true,
            data: posts,
            count: posts.length,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting posts", error });
    }
});
exports.getCampaignPosts = getCampaignPosts;
