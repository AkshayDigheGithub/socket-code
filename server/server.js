const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("new user connected");

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the admin app")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined")
  );

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`server listining on ${port}`);
});
