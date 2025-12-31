require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbConfig");

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`server is running on ${port} port`);
});
