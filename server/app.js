const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const { submitProject } = require('./controllers/projectController');
const { getProjects } = require('./controllers/projectController');
const { authenticateUser } = require('./controllers/loginController');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);

// Define a route to serve the main page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/login/err', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/loginErr.html'));
});


app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

app.post('/api/projects/submit', submitProject);

app.get('/api/projects', getProjects);

app.post('/api/login', authenticateUser);

app.get('/api/project/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  fs.readFile('./server/data/projects.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const jsonArray = JSON.parse(data);
    const project = jsonArray.find(obj => obj.projectID === projectId);
    console.log('Project parsed is ::',project);

    if (project) {
      console.log('Current status is NOT being set to NULL');
      res.json({ currentStatus: project.projectStatus });
    } else {
      console.log('Current status is being set to NULL');
      res.json({ currentStatus: null });
    }
  });
});

app.get('/api/projectObj/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  fs.readFile('./server/data/projects.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const jsonArray = JSON.parse(data);
    const project = jsonArray.find(obj => obj.projectID === projectId);
    console.log('Project parsed is ::',project);

    if (project && project.projectID) {
      console.log('Current status is NOT being set to NULL');
      res.json({ project });
    } else {
      console.log('Current status is being set to NULL');
      res.json({ project: null });
    }
  });
});


app.post('/api/update', (req, res) => {
  console.log(req);
  const newStatus = req.body.changeStatusTo;
  const projectId = req.body.projectId;
  console.log('Status received to update API as :: ',newStatus, projectId);
  fs.readFile('./server/data/projects.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let jsonArray = JSON.parse(data);
    const projectIndex = jsonArray.findIndex(obj => obj.projectID === projectId);

    if (projectIndex !== -1) {
      jsonArray[projectIndex].projectStatus = newStatus;
      console.log('Updated Project  ::',jsonArray[projectIndex]);

      fs.writeFile('./server/data/projects.json', JSON.stringify(jsonArray, null, 2), 'utf8', err => {
        if (err) {
          console.error('Error writing to file:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json({ message: 'Project status updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

