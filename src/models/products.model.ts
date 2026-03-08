import mongoose, { Schema, Document } from "mongoose"

export interface IProduct extends Document {
    institute: mongoose.Types.ObjectId,
    name: string
    price: number
    description?: string
    features?: string[]
    material?: string
    category?: string
    tags?: string[]
    targetAudience?: string[]
    images?: string[]
    brand?: string
    stock?: number
    status: "active" | "inactive"
}

const ProductSchema = new Schema<IProduct>(
    {
        institute: { type: Schema.Types.ObjectId, required: true,ref:"Institute" },
        name: { type: String, required: true },
        price: { type: Number, required: true, },
        description: { type: String, },
        features: [{ type: String, },],
        material: { type: String, },
        category: { type: String, },
        tags: [{ type: String, },],
        targetAudience: [{ type: String, },],
        images: [{ type: String, },],
        brand: { type: String, },
        stock: { type: Number, default: 0, },
        status: { type: String, enum: ["active", "inactive"], default: "active", },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IProduct>(
    "Product",
    ProductSchema
)