require("dotenv").config();
const app = require("./src/index");
const { app: {port} } = require("./src/configs/config.mongodb")

const server = app.listen(port, () => {console.log(`Listen on port :${port}`)});

process.on("SIGNT", () =>{
    server.close(() => console.log("Server Close"))
})