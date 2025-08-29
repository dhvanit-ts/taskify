import { env } from "./conf/env";
import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import http from "http";
// routes
import healthRouter from "./routes/health.route";
import userRouter from "./routes/user.routes";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.ACCESS_CONTROL_ORIGIN,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

const corsOptions: CorsOptions = {
  origin: env.ACCESS_CONTROL_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

io.on("connection", (socket) => {
  // define your function
});

// routes
app.use("/api/v1/users", healthRouter);
app.use("/api/v1/users", userRouter);

export default server;
