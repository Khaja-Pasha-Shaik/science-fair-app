const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Function to authenticate the user based on the entered username and password

function authenticateUser(req, res) {
    const { username, password } = req.body;
  
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading users.json:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }
  
      const users = JSON.parse(data) || [];
      console.log(users);
      const user = users.find((user) => user.name === username);
  
      if (!user) {
        console.log('User not found:', username);
        res.redirect('/login/err');
        return;
      }
  
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ error: 'Internal server error.' });
        }
  
        if (result) {
          console.log('User authenticated:', username);
          res.redirect('/dashboard');
        } else {
          console.log('Invalid password for user:', username);
          res.redirect('/login/err');
        }
      });
    });
  }

  
  module.exports = { authenticateUser };