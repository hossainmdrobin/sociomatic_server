import { Request, Response } from "express";
import Campaign, { ICampaign } from "../../models/campaign.model";
import { generatePlan } from "./helpers";
import { Post } from "../../models/post.model";
import campaignService from "../../services/campaign.service";

export const createCampaign = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaign = new Campaign({...req.body, user: req.user._id,institute: req.user.institute} as ICampaign);
        const savedCampaign = await campaign.save();
        const plan = await generatePlan(String(savedCampaign._id));
        const readyPlan = plan.map((p)=>({
            ...p,
            campaign: savedCampaign._id,
            admin: req.user._id,
            creator: req.user._id,
            institute: req.user.institute,
            account:savedCampaign.account,
        }))

        await Post.insertMany(readyPlan);        
        res.status(201).json(savedCampaign);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error creating campaign", error });
    }
};

export const getAllCampaigns = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaigns = await Campaign.find({ institute: req.user.institute }).populate("user").populate("products");
        res.status(200).json(campaigns);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching campaigns", error });
    }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate("user")
            .populate("products");
        
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaign", error });
    }
};

export const getCampaignsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaigns = await Campaign.find({ user: req.params.userId })
            .populate("user")
            .populate("products");
        
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user campaigns", error });
    }
};

export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("user").populate("products");
        
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ message: "Error updating campaign", error });
    }
};

export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        await Post.deleteMany({ campaign: req.params.id });
        
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        
        res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting campaign", error });
    }
};

export const updateCampaignStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const validStatuses = ["draft", "active", "completed", "paused"];
        
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate("user").populate("products");
        
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ message: "Error updating campaign status", error });
    }
};

export const updateCampaignStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        
        campaign.stats = {
            ...campaign.stats,
            ...req.body,
        };
        
        await campaign.save();
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ message: "Error updating campaign stats", error });
    }
};

export const generateCampaignPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: campaignId } = req.params;
        
        await campaignService.startGeneration(campaignId);
        
        res.status(202).json({
            success: true,
            message: "Post generation started",
            campaignId,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error starting generation", error });
    }
};

export const getCampaignGenerationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: campaignId } = req.params;
        const status = await campaignService.getStatus(campaignId);
        
        res.json({
            success: true,
            data: status,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting status", error });
    }
};

export const getCampaignPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: campaignId } = req.params;
        const { limit, skip } = req.query;
        
        const posts = await campaignService.getPosts(campaignId, {
            limit: limit ? parseInt(limit as string) : undefined,
            skip: skip ? parseInt(skip as string) : undefined,
        });
        
        res.json({
            success: true,
            data: posts,
            count: posts.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting posts", error });
    }
};