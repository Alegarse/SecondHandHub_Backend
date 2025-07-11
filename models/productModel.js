const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      validate: {
        validator: (val) => val.length <= 6,
        message: "Máx 6 images",
      },
    },
    category: {
      type: String,
      enum: [
        "Vehicle",
        "Vehicle accessories",
        "Real Estate",
        "Technology",
        "Sport and leisure",
        "Bicycles",
        "Home and garden",
        "Appliances",
        "Music, books and movies",
        "Children and babies",
        "Construction",
        "Others",
      ],
      required: true,
    },
    condition: {
      type: String,
      enum: [
        "Brand new",
        "In box",
        "Like new",
        "Good condition",
        "Acceptable",
        "Well used",
      ],
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        country: String,
        region: String,
        province: String,
        city: String,
      },
    },
    status: {
      type: String,
      enum: [ 'active', 'inactive', 'reserved', 'sold'],
      default: 'active',
    },
    lastActivatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ location: "2dsphere" });

const productModel = mongoose.model("Product", productSchema, "products");

module.exports = productModel;
