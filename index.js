const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");

// BD
const {
  getTodos,
  updateTodo,
  addTodo,
  removeTodo,
} = require("./bd/actionJson");

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Templating engine setup

app.set("view engine", "ejs");

// Aplication
app.get("/", (req, res) => {
  let response = getTodos();
  res.render("index", { todos: response.data });
});

// Enpoints

app.get("/todos", (req, res) => {
  let response = getTodos();
  res.send(response);
});

app.post("/", (req, res) => {
  let { description } = req.body;
  addTodo(description);
  let response = getTodos();
  res.render("index", { todos: response.data });
});

app.post("/update", (req, res) => {
  let { _uid, description, state } = req.body;
  updateTodo(_uid, description, state);
  let response = getTodos();
  res.render("index", { todos: response.data });
});

app.put("/:_uid/:description/:state", (req, res) => {
  let { _uid, description, state } = req.params;
  let response = updateTodo(_uid, description, state);
  res.send(response);
});

app.delete("/:_uid", (req, res) => {
  let { _uid } = req.params;
  let response = removeTodo(_uid);
  res.send(response);
});

// Starting server.

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
