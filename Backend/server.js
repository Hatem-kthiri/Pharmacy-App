const express = require("express");
const path = require("path");
var cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const connectDB = require("./config/DataBase");
const users = require("./routes/users");
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
connectDB();
app.use(bodyParser.json());

// Routes
app.use("/api/users", users);
// app.use('/api/pharmacies', pharmacies);
// app.use('/api/providers', providers);

const port = process.env.PORT || 5000;

app.get("/", function (req, res) {
  res.send("this is from backend");
});

app.listen(port, () => {
  console.log(`APP listening at ${port}`);
});
