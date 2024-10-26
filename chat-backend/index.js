const express = require("express");
const connectDB = require("./config/DBconfig");
const { errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5555;

// Database connection
connectDB();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to chat app",
  });
});

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/user/chat", require("./routes/chatRoute"));
app.use("/api/user/message", require("./routes/msgRoutes"));

// error handler
app.use(errorHandler);

// Server listening
const server = app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://finalchat-eight.vercel.app/?vercelToolbarCode=cFp-FwV6IzSjfAU",
    methods: ["GET", "POST"],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("Conntected to socket io");

  socket.on("new-user-add", (newId) => {
    // if user is not already added
    if (!activeUsers.some((user) => user.userId === newId)) {
      activeUsers.push({
        userId: newId,
        socketId: socket.id,
      });
    }
    console.log("conected users", activeUsers);
    io.emit("get-active-users", activeUsers);
  });

  socket.on("disconnet", () => {
    activeUsers = activeUsers.filte((user) => user.socket.Id !== socket.id);

    io.emit("get-active-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to:", receiverId);
    console.log("Data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

});
