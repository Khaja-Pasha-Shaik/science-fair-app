const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

exports.signup = async (req, res) => {
  const { name, password, confirmPassword } = req.body;

  // Check if all fields are filled and passwords match
  if (!name || !password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({ message: 'Invalid form data' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Read existing user data from the JSON file
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersFilePath));
  } catch (error) {
    // If the file doesn't exist or is empty, an empty array will be used.
  }

  // Check if the user already exists (using a unique identifier like name is recommended)
  const existingUser = users.find((user) => user.name === name);
  if (existingUser) {
    return res.status(409).json({ message: 'User Name already exists' });
  }

  users.push({ name, password: hashedPassword, isAdmin:false });

  // Save the updated user data to the JSON file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.redirect('/dashboard');
};