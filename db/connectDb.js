const mongoose = require("mongoose");

const URI_MONGODB = process.env.URL_MONGO_DB;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(URI_MONGODB);
        console.log("Conexión a MongoDb exitosa");
    } catch (error) {
    console.log("Error al conectar con MongoDb", error);
    }
}

module.exports = connectToDatabase;