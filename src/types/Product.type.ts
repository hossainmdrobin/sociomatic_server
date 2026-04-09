export interface IProduct {
    name?: string
    price?: number
    description?: string
    features?: string[]
    material?: string
    category?: string
    tags?: string[]
    targetAudience?: string[]
    images?: string[]
    brand?: string
    stock?: number
    status?: "active" | "inactive"
    createdAt?: Date
    updatedAt?: Date
}