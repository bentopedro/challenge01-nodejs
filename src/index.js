const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  request.user = user;

  next();
}

/**
 * name: string
 * username: string
 */
app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  )

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists" })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).json(users);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  if (user.todos === null) {
    // not working right now
    return response.status(404).json({ error: "todos: not found" })
  }

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const taskTODOS = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    create_at: new Date()
  }

  user.todos.push(taskTODOS)

  return response.status(201).json(taskTODOS)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => id === id)

  if (!todo) {
    return response.status(404).json({ error: 'Non existing ToDo' })
  }
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(user.todos)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => id === id)

  if (!todo) {
    return response.status(404).json({ error: 'Non existing ToDo' })
  }

  todo.done = true;

  return response.json(user.todos)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => id === id)

  if (!todo) {
    return response.status(404).json({ error: 'Non existing ToDo' })
  }

  user.todos.splice(todo.id, 1);

  return response.json(user.todos)

});

module.exports = app;