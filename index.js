import "dotenv/config";
import "./database/connectdb.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import redirectRouter from "./routes/redirect.route.js";

const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("CORS origin error: " + origin + "Not authorized");
    },
  })
);

app.use(express.json());
app.use(cookieParser());

// Example back redirect (optional)
app.use("/", redirectRouter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);

// Just for login/token example
// app.use(express.static("public"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listen on http://localhost:${PORT}`));
