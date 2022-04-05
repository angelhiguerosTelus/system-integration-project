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
  // let response = getTodos();
  res.render("index");
});

// Enpoints

app.get("/todos", (req, res) => {
  let response = getTodos();
  res.send(response);
});


app.post("/todos", (req, res) => {
  let { description } = req.body;
  let newTodo = addTodo(description);
  res.send(newTodo);
});

app.put("/todos", (req, res) => {
  let { _uid, description, state } = req.body;
  updateTodo(_uid, description, state);

  let response = getTodos();
  res.send(response);
});


app.delete("/todos", (req, res) => {
  let { _uid } = req.body;
  removeTodo(_uid);

  let response = getTodos();
  res.send(response);
});




// Starting server.

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
