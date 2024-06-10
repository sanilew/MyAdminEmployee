const mongoose = require("mongoose");
const mongoURL = "mongodb://localhost:27017/";

const connectToMongo = () => {
  mongoose.connect(mongoURL, {}, (err) => {
    if (err) {
      console.error("Error connecting to Mongo.", err);
    } else {
      console.log("Connected to Mongo Successfully");
    }
  });
};

module.exports = connectToMongo;
