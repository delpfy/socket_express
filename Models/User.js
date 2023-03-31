import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    avatarUrl: {
      type: String,
    },
  },
  {
    timespamps: true,
  }
);


export default mongoose.model('User', UserSchema);