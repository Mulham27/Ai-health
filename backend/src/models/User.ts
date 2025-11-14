import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
    email: string;
    name?: string;
    passwordHash: string;
    resetPasswordToken?: string | null;
    resetPasswordExpiresAt?: Date | null;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    passwordHash: { type: String, required: true },
    resetPasswordToken: { type: String, default: null, index: true },
    resetPasswordExpiresAt: { type: Date, default: null },
}, { timestamps: true });

userSchema.methods.comparePassword = async function(password: string) {
    return bcrypt.compare(password, this.passwordHash);
}

export const User = mongoose.model<UserDocument>("User", userSchema);


