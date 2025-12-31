const express = require("express");
const todoRouter = require("./routes/todoRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/todos", todoRouter);

module.exports = app;
