const fs = require("fs");
var path = require("path");
var pathConfig = path.resolve(__dirname, "./config.json");
var pathTodos = path.resolve(__dirname, "./todos.json");

let config = {};
let todos = [];

const readFiles = () => {
  config = JSON.parse(fs.readFileSync(pathConfig));
  todos = JSON.parse(fs.readFileSync(pathTodos));
};

const writeFiles = () => {
  let dataConfig = JSON.stringify(config);
  fs.writeFileSync(pathConfig, dataConfig);

  let dataTodos = JSON.stringify(todos);
  fs.writeFileSync(pathTodos, dataTodos);
};

//Config
const setUID = () => {
  readFiles();
  let uid = config._uid;
  let newID = config._uid + 1;
  config._uid = newID;
  writeFiles();
  return uid;
};

// Todos
const getTodos = () => {
  readFiles();
  return {
    error: "",
    data: todos,
  };
};

const addTodo = (description) => {
  readFiles();

  let newTodo = {
    _uid: setUID(),
    description: description,
    state: false,
  };

  todos = [...todos, { ...newTodo }];

  writeFiles();
  return {
    error: "",
    data: newTodo,
  };
};

const updateTodo = (_uid, description, state) => {
  readFiles();

  let res = todos.filter((todo) => parseInt(_uid) === parseInt(todo._uid));
  if (res.length === 0) {
    return {
      error: "Todo not found",
      data: "",
    };
  } else {
    let tempTodos = [];
    todos.map((todo) =>
      parseInt(_uid) === parseInt(todo._uid)
        ? tempTodos.push({
            _uid: todo._uid,
            description: description,
            state: JSON.parse(state),
          })
        : tempTodos.push(todo)
    );

    todos = tempTodos;

    writeFiles();
    res = todos.filter((todo) => parseInt(_uid) === parseInt(todo._uid));
    return {
      error: "",
      data: res[0],
    };
  }
};

const removeTodo = (_uid) => {
  readFiles();

  todos = todos.filter(
    (todo) => parseInt(_uid) !== parseInt(todo._uid)
  );

  console.log(_uid)


  writeFiles();
  return {
    error: "",
    data: `Todo ${_uid} removed`,
  };
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  removeTodo,
};
