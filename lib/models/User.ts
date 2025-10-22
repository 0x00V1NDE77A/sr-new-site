// models/User.ts
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Force Node.js runtime to avoid Edge Runtime issues with MongoDB
export const runtime = 'nodejs';

interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin: Date | null;
}

interface IUserModel {
  authenticate(email: string, password: string): Promise<IUser | null>;
}

// Static method for authentication using MongoDB driver instead of Mongoose
const authenticate = async (email: string, password: string): Promise<IUser | null> => {
  try {
    console.log("🔍 Attempting to find user:", email);
    
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return null;
    }
    
    console.log("✅ User found:", { email: user.email, role: user.role });
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      console.log("❌ Invalid password for:", email);
      return null;
    }

    console.log("✅ Password valid, updating last login");
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Convert MongoDB document to IUser interface
    const userData: IUser = {
      _id: user._id,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    return userData;
  } catch (error) {
    console.error("❌ Authentication error:", error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('buffering timed out')) {
        throw new Error("Database connection timeout. Please try again.");
      } else if (error.message.includes('Server selection timed out')) {
        throw new Error("Database server unavailable. Please try again later.");
      }
    }
    
    throw error;
  }
};

// Export the authenticate function directly
export { authenticate };

// For backward compatibility, create a User object with the authenticate method
const User: IUserModel = {
  authenticate
};

export default User;
