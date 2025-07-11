const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  dni: {
    type: String,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
  },
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
  },
  chats: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Chat",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastAccess: {
    type: Date,
    default: Date.now,
  },
  location : {
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    },
    address: {
        country: String,
        region: String,
        province: String,
        city: String
    }
  }
});

const userModel = mongoose.model("User", userSchema, "users");

module.exports = userModel;
