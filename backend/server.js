const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/commonRoute"));

// app.get("/", async (req, res) => {
//   console.log("hi we are running");
//   return res.json("Hiii we are running");
// });
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
  );
} else {
  app.get("/api", (req, res) => {
    res.send("Api is running");
  });
}
app.listen(PORT, () => console.log("Server is running..."));
