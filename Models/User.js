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

    role: {
      type: String,
      required: true,
    },

    expences: {
      type: Number,
      required: true,
    },

    avatarUrl: {
      type: String,
    },
    emailConfirmationToken: {
      type: String,
    },
    emailConfirmed: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
