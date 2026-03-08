import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
    name:{type:String,required:true},
    slogan:{type:String},
    description:{type:String},
    type:{type:String}
},{
  timestamps: true
});

export const Institute = mongoose.model("Institute", instituteSchema);
