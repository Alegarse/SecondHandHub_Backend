const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      max: 250,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ from: 1, produt: 1 }, { unique: true });

reviewSchema.post("save", async function () {

  const Review = this.constructor;
  const reviews = await Review.find({ to: this.to });
  const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const average = reviews.length > 0 ? total / reviews.length : 0;

  await mongoose.model("User").findByIdAndUpdate(this.to, {
    averageRating: average,
    reviewCount: reviews.length,
  });
  
});

const reviewModel = mongoose.model("Review", reviewSchema, "reviews");
module.exports = reviewModel;
