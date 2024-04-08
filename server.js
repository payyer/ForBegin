require("dotenv").config();
const app = require("./src/index");
const { PORT } = process.env;

const server = app.listen(PORT, () => {console.log(`Listen on port :${PORT}`)});

process.on("SIGNT", () =>{
    server.close(() => console.log("Server Close"))
})