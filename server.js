const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User , Post } = require('./model');

const port = process.env.PORT || 3000;

const server = express();
server.use(bodyParser.json());

server.post('/users', (req, res) => {
  const { name, age } = req.body;
  const newUser = new User({ name, age });
  newUser.save(newUser, (err, user) => {
     if (err) {
       res.status(422);
       res.json({'Error saving user to DB: ': err.message});
       return;
     }
     res.json(user);
  });
});

server.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(422);
      res.json({'Error Fetching users from DB: ': err.message});
      return;
    }
    res.json(users);
  });
});

server.get('/users/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, user) => {
    if (err) {
      res.status(422);
      res.json({'Error Fetching single User from DB: ': err.message});
      return;
    }
    res.json(user);
  });
});

server.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndRemove(id, (err, deletedUser) => {
    if (!deletedUser) {
      res.status(422);
      res.json({'User not found': err.message});
      return;
    }
    res.json(deletedUser);
  });
});

server.put('/users/:id', (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  User.findByIdAndUpdate(id, {"name": name }, () => {
    User.findById(id)
    .exec((err, userUpdated) => {
      if (err) {
        res.status(422);
        res.json({'Error updating user': err.message});
        return;
      }
      res.json(userUpdated);
    });
  });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/test-users', 
  { useMongoClient: true }
);


connect.then(() => {
  server.listen(port);
  console.log(`Server listening on port ${port}`);
}, (err) => {
  console.log('\n**********************');
  console.log("ERROR: Failed to connect to MongoDB.");
  console.log('\n**********************');
});