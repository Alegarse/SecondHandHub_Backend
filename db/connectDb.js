const mongoose = require('mongoose');
const { createInitialContent } = require('../utils/mockData');
const { default: initialSetupMessage } = require('../core/utils/messages');
mongoose.set('strictQuery', true);

const URI_MONGODB = process.env.URL_MONGO_DB;

const connectToDatabase = async () => {
  await mongoose
    .connect(URI_MONGODB)
    .then(async () => {
      console.log('Successfully connected to MongoDB');
      if (createInitialContent()) initialSetupMessage();
    })
    .catch((error) => console.error(`MongoDb connection error: ${error}`));
};

module.exports = connectToDatabase;
