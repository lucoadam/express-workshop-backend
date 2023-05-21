import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
      name: {
          type: String,
          required: true
      },
      age: {
          type: Number,
          required: false
      },
      email: {
          type: String,
          required: true,
          unique: true
      },
      password: {
          type: String,
          required: true
      },
      address: {
        type: String,
        required: true
      }
    },
  );

export default mongoose.model("User", schema)