const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./src/routes/index");
const { responses } = require("./src/middleware/common");

const app = express();
const port = 3000;

app.use(cors());
app.use(morgan("dev"));
app.use("/img", express.static("./image"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.all("*", (req, res, next) => {
  responses(res, 404, false, null, "404 Not Found");
});

app.get("/", (req, res, next) => {
  res.status(200).json({ status: "success", statusCode: 200 });
});

app.listen(port, () => {
  console.log(`Food Recipes app listening on port ${port}`);
});
