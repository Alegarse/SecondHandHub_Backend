const mongoose = require("mongoose");
const { createInitialContent } = require("../utils/initialData");
mongoose.set("strictQuery", true);

const URI_MONGODB = process.env.URL_MONGO_DB;

const connectToDatabase = async () => {
  await mongoose
    .connect(URI_MONGODB)
    .then(() => {
      console.log("Successfully connected to MongoDB");
      createInitialContent();
    })
    .catch((error) => console.error(`MongoDb connection error: ${error}`));
};

module.exports = connectToDatabase;
