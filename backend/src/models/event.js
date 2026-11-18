import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minlength: [3, "title must be at least 3 characters"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
      enum: {
        values: ["Seminer", "Atölye", "Konferans", "Söyleşi", "Yarışma"],
        message: "Geçersiz kategori: {VALUE}",
      },
    },
    date: {
      type: String,
      required: [true, "date is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "capacity is required"],
      min: [0, "capacity must be at least 0"],
      default: 0,
    },
    time: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema, "events");

export default Event;
