const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "shortText",
        "longText",
        "singleChoice",
        "multipleChoice",
        "rating",
      ],
      default: "shortText",
      required: true,
    },

    options: {
      type: [String],
      default: [],
    },

    required: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questions", questionSchema);
