"use strict";

const mongoose = require("mongoose");
const { db: {host, port, name}} = require("../configs/config.mongodb");
const CONNECT_STRING_DB = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(CONNECT_STRING_DB, { maxPoolSize: 50 })
      .then(() => {
        console.log("Connected PRO!");
        countConnect();
      })
      .catch((err) => console.log("Error Connect!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
