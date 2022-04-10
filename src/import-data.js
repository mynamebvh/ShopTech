// TODO: import core module
const fs = require("fs");
// import fs from "fs";

// TODO: import third party module
const mongoose = require("mongoose");

// TODO: import own module
const Category = require("./models/category.model");


// TODO: connect to mongodb
mongoose
  .connect("mongodb://localhost/shoptech")
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

// TODO: read data from json file
const categorys = JSON.parse(fs.readFileSync("./database/category.json"));

// TODO: import data to database
const importData = async () => {
  try {
    await Category.insertMany(categorys);
    console.log("insert data successfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit(1);
};

// TODO: delete data to database
const deleteData = async () => {
  try {
    await Category.deleteMany();
    console.log("delete data successfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit(1);
};

// TODO: run script
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
