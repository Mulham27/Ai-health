import mongoose, { Schema, Document } from "mongoose";

export interface HealthEntryDocument extends Document {
    userId: mongoose.Types.ObjectId;
    entryText: string;
    moodScore: number;
    energyScore: number;
    sleepHours: number;
    steps?: number;
    aiAnalysis?: {
        sentiment: "positive" | "neutral" | "negative";
        keyTopics: string[];
        recommendations: string[];
        confidenceScore: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const healthEntrySchema = new Schema<HealthEntryDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    entryText: { type: String, required: true },
    moodScore: { type: Number, min: 0, max: 10, required: true },
    energyScore: { type: Number, min: 0, max: 10, required: true },
    sleepHours: { type: Number, min: 0, max: 24, required: true },
    steps: { type: Number },
    aiAnalysis: {
        sentiment: { type: String, enum: ["positive", "neutral", "negative"] },
        keyTopics: [{ type: String }],
        recommendations: [{ type: String }],
        confidenceScore: { type: Number },
    },
}, { timestamps: true });

export const HealthEntry = mongoose.model<HealthEntryDocument>("HealthEntry", healthEntrySchema);


