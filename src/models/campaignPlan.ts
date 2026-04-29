import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaignPlan extends Document {
  campaign: mongoose.Types.ObjectId;
  accounts: mongoose.Types.ObjectId[];
  day: number;
  planDescription: string;
  products: mongoose.Types.ObjectId[];
  numberOfPost: number;
}

const CampaignPlanSchema = new Schema<ICampaignPlan>({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    description: 'Unique identifier linking to the master campaign record',
  },
  accounts: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    required: true,
    description: 'List of account identifiers that will participate in or own this plan',
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    description: 'Day index in the campaign timeline (e.g., 1 for launch day)',
  },
  planDescription: {
    type: String,
    required: true,
    description: 'High-level narrative and objectives for the day, including key messages, audience segments, and desired outcomes',
  },
  products: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    required: true,
    description: 'Product or service identifiers to be highlighted by posts under this plan',
  },
  numberOfPost: {
    type: Number,
    required: true,
    min: 1,
    description: 'Total number of posts scheduled for this plan on the specified day',
  },
});

export default mongoose.model<ICampaignPlan>('CampaignPlan', CampaignPlanSchema);