import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    bussiness:{type:mongoose.Types.ObjectId, require:true,ref:"Institute"},
    type:{type:String},
    tone:{type:String},
    length:{type:String},
    language:{type:String},
    products:[{type:mongoose.Types.ObjectId,ref:"Product"}],
    description:{type:mongoose.Types.ObjectId},
    image:{type:Boolean},
    imageType:{Type:String},
    imageSize:{Type:String},
},{
  timestamps: true
});

export const Prompt = mongoose.model("Prompt", promptSchema);
