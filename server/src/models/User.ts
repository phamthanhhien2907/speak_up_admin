import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ProgressTracking from "./ProgressTracking";
export interface IUser extends Document {
    typeLogin: String;
    id: string;
    tokenLogin: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    refreshToken: string;
    avatar?: string;
    role: "student" | "teacher" | "admin";
    level: number;
    total_score: number;
    address: string,
    gender: "male" | "female" | "other";

    enrolledCoursesCount: number;
    phoneNumber: string,
    isCorrectPassword(password: string): Promise<boolean>;
    createPasswordChangedToken(): string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    passwordChangedAt?: string;
}

const UserSchema = new Schema<IUser>({
    id: { type: String },
    typeLogin: { type: String },
    tokenLogin: { type: String },
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    password: { type: String },
    refreshToken: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    level: { type: Number, default: 0 },
    address: { type: String, default: "" },
    gender: { type: String, default: "male" },
    phoneNumber: { type: String, default: "" },
    total_score: { type: Number, default: 0 },
    enrolledCoursesCount: { type: Number, default: 0 },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    passwordChangedAt: { type: String },
},
    {
        timestamps: true
    });
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
UserSchema.post('save', async function (doc) {
    const progress = await ProgressTracking.findOne({ userId: doc._id });
    if (progress) {
        doc.total_score = progress.totalScore;
        await doc.save();
    }
});
UserSchema.methods.isCorrectPassword = async function (
    password: string
): Promise<boolean> {
    if (!password || !this.password) {
        console.error("Missing password or hash for comparison");
        return false;
    }

    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        console.error("Error comparing passwords", err);
        return false;
    }
};
UserSchema.methods.createPasswordChangedToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    return resetToken;
};
export default mongoose.model<IUser>("User", UserSchema);
