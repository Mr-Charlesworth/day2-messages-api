import express from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const app = express();

let messages = [];
let users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/register', check(['username', 'password']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  const { username } = req.body
  if (users.some((u) => u.username === username)) {
    res.status(400)
    return res.send({ errors: ["Username already exists"]})
  }
  const token = uuidv4()
  users.push({ ...req.body, token });
  res.status(201);
  res.send({ token })
});

app.post('/api/login', check(['username', 'password']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    res.status(401);
    return res.send({ errors: ["Not Authorised"] })
  }
  res.status(200);
  res.send({ token: user.token })
});

app.use((req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || authorization === '') {
    res.status(401);
    return res.send({ errors: ["Not Authorised"] })
  }
  const user = users.find((u) => u.token === authorization)
  if (!user) {
    res.status(401);
    return res.send({ errors: ["Not Authorised"] })
  }
  req.user = user;
  next()
})

app.get('/api/messages', (req, res) => {
  res.send(messages);
});

app.get('/api/messages/:id', (req, res) => {
  const matched = messages.filter((message) => message.id === req.params.id)
  if (matched.length === 0) {
    res.statusMessage = "Message not found";
    return res.sendStatus(404);
  }
  res.send(matched[0]);
});

app.post('/api/messages', check(['message']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  const { message } = req.body
  messages.push({ message, id: uuidv4(), username: req.user.username });
  res.sendStatus(201);
});

app.put('/api/messages/:id', check(['message']), (req, res) => {
  const message = messages.find((m) => m.id === req.params.id)
  if (!message) {
    res.status = 404;
    return res.send({ errors: ["Message not found"] });
  }
  if (message.username !== req.user.username) {
    res.status = 400;
    return res.send({ errors: ["Not your message"] });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  messages = messages.map(m => {
    if (m.id === req.params.id) {
      return { ...m, message: message.message }
    }
  });
  res.sendStatus(204);
});

app.delete('/api/messages/:id', (req, res) => {
  const message = messages.find((m) => m.id === req.params.id)
  if (!message) {
    res.status = 404;
    return res.send({ errors: ["Message not found"] });
  }
  if (message.username !== req.user.username) {
    res.status = 400;
    return res.send({ errors: ["Not your message"] });
  }
  const numMessagesBeforeDelete = messages.length;
  messages = messages.filter((message) => message.id !== req.params.id)
  if (messages.length === numMessagesBeforeDelete) {
    res.statusMessage = "Message not found";
    return res.sendStatus(404);
  }
  res.sendStatus(200);
});

const port = process.env.PORT || 3001;


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});