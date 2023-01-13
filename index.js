const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./src/routes/index");
const { upload } = require("./src/middleware/upload");
const cookieParser = require("cookie-parser");
const { responses } = require("./src/middleware/common");

const app = express();
const port = 3000;
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
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

app.listen(3000, () => {
  console.log(`Food Recipes app listening on port 3000`);
});
