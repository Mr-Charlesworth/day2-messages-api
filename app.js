import express from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const app = express();

let messages = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


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

app.post('/api/messages', check(['from', 'message']), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  messages.push({ ...req.body, id: uuidv4() });
  res.sendStatus(201);
});

app.put('/api/messages/:id', check(['from', 'message']), (req, res) => {
  const matched = messages.filter((message) => message.id === req.params.id)
  if (matched.length === 0) {
    res.statusMessage = "Message not found";
    return res.sendStatus(404);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422)
    return res.send({ errors: errors.array() })
  }
  messages = messages.map(message => {
    if (message.id === req.params.id) {
      return { id: req.params.id, ...req.body }
    }
  });
  res.sendStatus(204);
});

app.delete('/api/messages/:id', (req, res) => {
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