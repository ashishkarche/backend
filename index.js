require("dotenv").config();
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("🤖 Lumi AI Backend is running ⚡");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running on port", port));
