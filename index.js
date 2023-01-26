const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.send({message: 'success', user});
  } catch (error) {
    console.log(error.message);
    next(error);
  }

  const hash = await bcrypt.hash(password, 10);
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  try {
    const loginA = { username:'bobbysmiles', password:'notright' } = req.body;
    const user = await User.findOne({ where: { username: loginA.username} });
    if (user[0]) {
      return true;
    } else {
      res.status(401).json({message: 'user not found'});
    }
    const userBobby  = user[0];
    const isMatch = await bcrypt.compare(loginA.password, user.password);
    if (isMatch) {
      return true;
    } else {
      res.status(401).json({message: 'incorrect password'});
    }
    res.send({message: 'success', password});
  }catch (error) {
    console.log(error.message);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
