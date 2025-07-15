const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const initialConfigSchema = new Schema(
    {
        initialProductsInserted: {
          type: Boolean,
          default:false
        },
        initialUsersInserted: {
          type: Boolean,
          default:false
        },
    }
)

const initialConfigModel = mongoose.model("Config", initialConfigSchema, "configs");

module.exports = initialConfigModel;