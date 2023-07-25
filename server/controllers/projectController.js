const fs = require('fs');
const path = require('path');

let nextProjectId = 50;

const projectsFilePath = path.join(__dirname, '../data/projects.json');

function generateProjectId() {
    const projectId = `SRNSF${nextProjectId.toString().padStart(4, '0')}`;
    nextProjectId++;
    return projectId;
  }

// Function to handle project submission
function submitProject(req, res) {
  const { username, projectName, projectDescription } = req.body;

  if (!username || !projectName || !projectDescription) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const projectData = {
    projectID:generateProjectId(),
    username,
    timestampIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    projectName,
    projectDescription,
    projectStatus: "SUBMITTED",
  };

  fs.readFile(projectsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    const projects = JSON.parse(data) || [];
    projects.push(projectData);

    fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }

      return res.status(200).json({ message: 'Project submitted successfully.' });
    });
  });
}

function getProjects(req, res) {
    fs.readFile(projectsFilePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }
  
      const projects = JSON.parse(data) || [];
      return res.status(200).json(projects);
    });
  }



module.exports = { submitProject, getProjects };
