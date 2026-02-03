import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type : String, 
        required: true 
    }
});



// Modern Typescript version of pre-save hook to hash password
userSchema.pre<IUser>("save", async function () {   // mongoose already understands promises no need of next() when async written
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;