const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reportedProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    comment : {
        type: String,
        trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const reportModel = mongoose.model("Report", reportSchema, "reports");
module.exports = reportModel;
