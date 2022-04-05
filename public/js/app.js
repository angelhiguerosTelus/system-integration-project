let table = document.querySelector("tbody");
let todos = [];

// Tools
const createTodoHTML = ({ _uid, description, state }) => {
  let newTodo = `
                <td>
                    <input ${
                      state && "checked"
                    } onchange="updateTodoStatus('${_uid}', '${description}', '${!state}');" type="checkbox" />
                </td>
                <td>
                    <span style="${
                      state && " text-decoration: line-through;"
                    }"> ${description} </span>
                </td>
                <td>
                    <i onclick="handleUpdateHTML('${_uid}', '${description}', '${state}')" class="bi bi-pencil"></i></td>
                <td>
                    <i onclick="deleteTodo('${_uid}')" class="bi bi-trash"></i>
                </td>
    `;
  let tr = document.createElement("tr");
  tr.innerHTML = newTodo;
  tr.id = _uid;

  table.append(tr);
};

const handleUpdateHTML = async (_uid, description, state) => {
  let input = document.querySelector("#description");
  let uidInput = document.querySelector("#_uid");
  let stateInput = document.querySelector("#state");

  input.value = description;
  uidInput.value = _uid;
  stateInput.value = state;

  let btnSave = document.querySelector("#btnSave");
  let btnUpdate = document.querySelector("#btnUpdate");

  btnSave.classList.add("is-hidden");
  btnUpdate.classList.remove("is-hidden");
};

const handleUpdateHTMLClean = async () => {
  let input = document.querySelector("#description");
  let uidInput = document.querySelector("#_uid");
  let stateInput = document.querySelector("#state");

  input.value = "";
  uidInput.value = "";
  stateInput.value = "";

  let btnSave = document.querySelector("#btnSave");
  let btnUpdate = document.querySelector("#btnUpdate");

  btnSave.classList.remove("is-hidden");
  btnUpdate.classList.add("is-hidden");
};

const updateTodoHTML = async (_uid, description, state) => {
  let tr = document.getElementById(_uid);
  tr.innerHTML = `
  <td>
      <input ${
        state && "checked"
      } onchange="updateTodoStatus('${_uid}', '${description}', '${!state}');" type="checkbox" />
  </td>
  <td>
      <span style="${
        state && " text-decoration: line-through;"
      }"> ${description} </span>
  </td>
  <td>
      <i onclick="handleUpdateHTML('${_uid}', '${description}', '${state}')" class="bi bi-pencil"></i></td>
  <td>
      <i onclick="deleteTodo('${_uid}')" class="bi bi-trash"></i>
  </td>
`;
};

// CRUD
const getTodos = async () => {
  table.innerHTML = "";
  todos = [];
  let data = await fetch(`/todos`);
  let res = await data.json();
  todos.push(...res.data);
  todos.map((todo) => createTodoHTML({ ...todo }));
};

const postTodo = async () => {
  let input = document.querySelector("#description");

  if (input.value !== "") {
    let data = await fetch(`/todos`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: input.value,
      }),
    });
    let res = await data.json();
    if (res.error === "") {
      createTodoHTML({ ...res.data });
      handleUpdateHTMLClean()
    } else {
      alert("Error was ocurred");
    }
  }
};

const deleteTodo = async (_uid) => {
  let data = await fetch(`/todos`, {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _uid: _uid,
    }),
  });

  let res = await data.json();

  if (res.error === "") {
    let tr = document.getElementById(_uid);
    table.removeChild(tr);
  } else {
    alert("Error was ocurred");
  }
};

const updateTodo = async () => {
  let _uid = document.querySelector("#_uid");
  let description = document.querySelector("#description");
  let state = document.querySelector("#state");

  let data = await fetch(`/todos`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _uid: _uid.value,
      description: description.value,
      state: state.value,
    }),
  });

  let res = await data.json();
  if (res.error === "") {
    updateTodoHTML(_uid.value, description.value, state.value);
    handleUpdateHTMLClean()
  } else {
    alert("Error was ocurred");
  }
};

const updateTodoStatus = async (_uid, description, state) => {
  let data = await fetch(`/todos`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _uid: _uid,
      description: description,
      state: state,
    }),
  });

  if (data.error !== "") {
    updateTodoHTML(_uid, description, state);
    handleUpdateHTMLClean()

  } else {
    alert("Error was ocurred");
  }
};

// Init application
getTodos();
