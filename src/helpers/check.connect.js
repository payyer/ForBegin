// Kiểm tra hệ thống có bao nhiêu Connect
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _Seconds = 5000;

// Count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection: ${numConnection}`);
};

// Check overload
const checkOverLoad = () => {
  setInterval(() => {
    // Kiểm tra số lượng connect
    const numConnection = mongoose.connections.length;
    // Kiểm tra Core trong CPU
    const numCore = os.cpus().length;
    // Kiểm tra memory đã xử dụng
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connection : ${numConnection}`)
    console.log(`Memory Usage : ${memoryUsage / 1024 / 1024} MB`)

    // Example maximum number of connections based of cores
    const maxConnection = numCore * 5

    // Nếu sl connection lớn hơn maxinum number connect của core thì log ra
    if (numConnection > maxConnection) {
      console.log(`Connection Overload detected!`)
    }
  }, _Seconds); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverLoad,
};
