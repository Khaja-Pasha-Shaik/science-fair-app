// Get elements
const usernameElement = document.getElementById('username');
const submitProjectBtn = document.getElementById('submitProjectBtn');
const viewMyProjectsBtn = document.getElementById('viewMyProjectsBtn');
const projectOverviewBtn = document.getElementById('projectOverviewBtn');
const viewMilestonesBtn = document.getElementById('viewMilestonesBtn');
const generateCertificate = document.getElementById('generateCertificate');
const rightPane = document.querySelector('.right-pane');

// Function to update the right pane content
function updateRightPane(content) {
  rightPane.innerHTML = content;
}

const username = this.username;

submitProjectBtn.addEventListener('click', () => {
  const content = `
      <h2>Submit a New Project</h2>
      <form id="projectForm">
        <div class="form-group">
          <label for="projectName">Project Name:</label>
          <input type="text" id="projectName" name="projectName" required>
        </div>
  
        <div class="form-group">
          <label for="projectDescription">Project Description:</label>
          <textarea id="projectDescription" name="projectDescription" rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label for="projectOwner">Project Owner:</label>
          <select id="projectOwner" name="projectOwner" class="custom-dropdown">
          <option value="Jaffar Hussain">Jaffar Hussain</option>
          <option value="Fazal Hussain">Fazal Hussain</option>
          <option value="Arshiya Tarunnum">Arshiya Tarunnum</option>
          <option value="Yashfeen">Yashfeen</option>
          <option value="Aaliya Anum">Aaliya Anum</option>
	        </select>
        </div>
  
        <button type="submit" class="submit-button" disabled>Submit Project</button>
      </form>
    `;
  updateRightPane(content);

  const projectNameInput = document.getElementById('projectName');
  const projectDescriptionInput = document.getElementById('projectDescription');
  const projectOwnerInput = document.getElementById('projectOwner');
  const submitButton = document.querySelector('.submit-button');

  projectNameInput.addEventListener('input', updateSubmitButton);
  projectDescriptionInput.addEventListener('input', updateSubmitButton);
  projectOwnerInput.addEventListener('input', updateSubmitButton);

  function updateSubmitButton() {
    if (projectNameInput.value.trim() !== '' && projectDescriptionInput.value.trim() !== ''
      && projectOwnerInput.value.trim() !== '') {
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', 'true');
    }
  }

  const projectForm = document.getElementById('projectForm');
  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectName = formData.get('projectName');
    const projectDescription = formData.get('projectDescription');
    const projectOwner = formData.get('projectOwner');

    // Get the current username from the page content (or from localStorage, etc.)
    const username = projectOwner;

    // Get the current timestamp in IST (Indian Standard Time)
    const timestampIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Create the project data object
    const projectData = {
      username,
      timestampIST,
      projectName,
      projectDescription,
    };

    submitProjectData(projectData);

  });
});

function submitProjectData(projectData) {
  fetch('/api/projects/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data (e.g., show success message, update UI, etc.)
      console.log(data.message);
      const successMessage = '<p>Project submitted successfully!</p>';
      updateRightPane(successMessage);
    })
    .catch((error) => {
      // Handle any errors that occurred during the submission
      console.error('Error submitting project:', error);
      const errorMessage = '<p>Error submitting project. Please try again later.</p>';
      updateRightPane(errorMessage);
    });
}

// Function to handle the "View my projects" button click
viewMyProjectsBtn.addEventListener('click', () => {
  fetch('/api/projects') // Fetch the project data from the server
    .then((response) => response.json())
    .then((projects) => {
      if (projects.length === 0) {
        const noProjectsMessage = '<p>No projects found.</p>';
        updateRightPane(noProjectsMessage);
      } else {
        const tableHTML = generateProjectsTable(projects);
        updateRightPane(tableHTML);
      }
    })
    .catch((error) => {
      console.error('Error fetching projects:', error);
      const errorMessage = '<p>Error fetching projects. Please try again later.</p>';
      updateRightPane(errorMessage);
    });
});

// Function to generate the projects table HTML
function generateProjectsTable(projects) {
  let tableHTML = '<h2>All Projects</h2>';
  tableHTML += '<table>';
  tableHTML += '<thead><tr><th>Project ID</th><th>Project Name</th><th>Project Owner</th><th>Submitted Date</th><th>Project Status</th></tr></thead>';
  tableHTML += '<tbody>';

  projects.forEach((project) => {
    tableHTML += '<tr>';
    tableHTML += `<td>${project.projectID}</td>`;
    tableHTML += `<td>${project.projectName}</td>`;
    tableHTML += `<td>${project.username}</td>`;
    tableHTML += `<td>${project.timestampIST}</td>`;
    tableHTML += `<td class="${project.projectStatus.toLowerCase().replace(/\s/g, '')}"><strong>${project.projectStatus}</strong></td>`;
    tableHTML += '</tr>';
  });

  tableHTML += '</tbody>';
  tableHTML += '</table>';
  return tableHTML;
}


changeStatusButton.addEventListener('click', () => {
  const content1 = `
  <form id="projectForm">
        <div class="form-group">
          <label for="projectId">Project ID:</label>
          <input type="text" id="projectId" name="projectId" required>
        </div>

        <button type="submit" class="submit-button" name="fetchBtn">Fetch Project Status</button>
  
        <div class="form-group">
          <label for="currentStatus">Project Current Status:</label>
          <input type="text" id="currentStatus" name="currentStatus" readonly>
        </div>

        <div class="form-group">
          <label for="adminPassword">Admin Password:</label>
          <input type="password" id="adminPassword" name="adminPassword">
        </div>

        <div class="form-group">
          <label for="changeStatusTo">Change Project Status to:</label>
          <select id="changeStatusTo" name="changeStatusTo" class="custom-dropdown">
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="READY FOR DISPLAY">READY FOR DISPLAY</option>
          <option value="COMPLETED">COMPLETED</option>
	        </select>
        </div>
  
        <button type="submit" name="submitBtn" class="submit-button">Change Status</button>
      </form>
    `;
  updateRightPane(content1);

  const projectForm = document.getElementById('projectForm');

  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectId = formData.get('projectId');
    const changeStatusTo = formData.get('changeStatusTo');
    const adminPassword = formData.get('adminPassword');

    console.log('1::', changeStatusTo);
    const fetchBtn = event.submitter.name === 'fetchBtn';
    const submitBtn = event.submitter.name === 'submitBtn';

    if (fetchBtn) {
      fetch(`/api/project/${projectId}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.currentStatus) {
            document.getElementById('currentStatus').value = data.currentStatus;
          } else {
            document.getElementById('currentStatus').value = 'Project not found';
          }
        })
        .catch(error => {
          console.error('Error fetching project status:', error);
        });
    }

    if (submitBtn) {
      const isAdmin = checkIfUserIsAdmin(adminPassword);
      console.log('change status is 3 ::', changeStatusTo);
      if (isAdmin) {
        fetch('/api/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ projectId, changeStatusTo })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.message);
            const successMessage = '<p>Project status updated successfully!</p>';
            updateRightPane(successMessage);
          })
          .catch(error => {
            console.error('Error updating project status:', error);
          });
      } else {
        const notAdminMessage = '<p class="not-admin">Please contact your Admin - Khaja Pasha to update project status!</p>'
        updateRightPane(notAdminMessage);
      }
    }

    function checkIfUserIsAdmin(adminPassword) {
      if (adminPassword === 'Maverick@2') {
        return true;
      }
      return false;
    }
    // submitProjectData(projectId, projectStatusNew);

  });

});



projectOverviewBtn.addEventListener('click', () => {
  const content1 = `
    <form id="projectForm">
          <div class="form-group2">
            <label for="projectId">Project ID:</label>
            <input type="text" id="projectId" name="projectId" required>
          </div>
  
          <button type="submit" class="submit-button2" name="fetchBtn">Get Project Details</button>

          <div id="projectDetails">
    <h2>Project Details</h2>
    <p><strong>Name:</strong> <span id="projectName"></span></p>
    <p><strong>Description:</strong> <span id="projectDescription"></span></p>
    <p><strong>Owner:</strong> <span id="projectOwner"></span></p>
    <p><strong>Submitted Date:</strong> <span id="submittedDate"></span></p>
    <p><strong>Status:</strong> <span id="projectStatus"></span></p>
  </div>
        </form>
      `;
  updateRightPane(content1);

  const projectForm = document.getElementById('projectForm');

  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectId = formData.get('projectId');

    fetch(`/api/projectObj/${projectId}`)
      .then(response => response.json())
      .then(data => {
        if (data.project) {
          console.log('Project data bro :: ', data.project);
          document.getElementById('projectName').textContent = data.project.projectName;
          document.getElementById('projectDescription').textContent = data.project.projectDescription;
          document.getElementById('projectOwner').textContent = data.project.username;
          document.getElementById('submittedDate').textContent = data.project.timestampIST;
          document.getElementById('projectStatus').textContent = data.project.projectStatus;

          showProjectDetails();
        } else {
          updateRightPane('<p class="project-not-completed">No project exists with the given Project ID</p>');
        }
      })
      .catch(error => {
        console.error('Error fetching project status:', error);
      });

    function showProjectDetails() {
      document.getElementById('projectDetails').style.display = 'block';
    }

  });


});



viewMilestonesBtn.addEventListener('click', () => {
  const content1 = `
      <div class="right-pane-milestone" id="milestoneTable">
      <h2>Milestone Table</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Reached Milestone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jaffar Hussain</td>
            <td>Beginner</td>
          </tr>
          <tr>
            <td>Arshiya Tarunnum</td>
            <td>Beginner</td>
          </tr>
          <tr>
            <td>Yashfeen</td>
            <td>Beginner</td>
          </tr>
          <tr>
            <td>Fazal Hussain</td>
            <td>Beginner</td>
          </tr>
          <tr>
            <td>Aaliya Anum</td>
            <td>Beginner</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="path-container">
  <div class="pointer beginner">Beginner</div>
  <div class="pointer explorer">Explorer</div>
  <div class="pointer master">Master</div>
  <div class="pointer guru">Guru</div>
  <div class="pointer expert">Expert</div>
</div>

    
        `;
  updateRightPane(content1);

});



generateCertificate.addEventListener('click', () => {
  const content1 = `
        <form id="projectForm">
              <div class="form-group2">
                <label for="projectId">Project ID:</label>
                <input type="text" id="projectId" name="projectId" required>
              </div>
      
              <button type="submit" class="submit-button2" name="genCert">Generate Certificate</button>
    
              <div id="image-container-certificate">
              <img src="../images/certificate.jpeg" alt="Your Certificate Image" id="certificateImage">
              <div class="project-ownerNtitle-names">
              <h2 id="projectOwner"></h2>
              <p id="projectName"></p>
              </div>
            </div>
            <button type="submit" class="submit-button3" id="downloadCertBtn" name="downloadCert">Download Certificate</button>
            </form>
          `;
  updateRightPane(content1);
  const projectForm = document.getElementById('projectForm');

  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectId = formData.get('projectId');

    const genCert = event.submitter.name === 'genCert';
    const downloadCert = event.submitter.name === 'downloadCert'
    if (genCert) {

      fetch(`/api/projectObj/${projectId}`)
        .then(response => response.json())
        .then(data => {
          if (data.project && data.project.projectStatus === 'COMPLETED') {
            document.getElementById('projectName').textContent = data.project.projectName;
            document.getElementById('projectOwner').textContent = data.project.username;
            showProjectDetails();
          } else {
            updateRightPane('<p class="project-not-completed">Project not found or completed</p>');
          }
        })
        .catch(error => {
          console.error('Error fetching project status:', error);
        });
    }

    if (downloadCert) {
      const certificateImage = document.getElementById('certificateImage');
      const projectName = document.getElementById('projectName').textContent;
      const projectOwner = document.getElementById('projectOwner').textContent;

      // Create a new canvas element
      const canvas = document.createElement('canvas');
      canvas.width = certificateImage.width;
      canvas.height = certificateImage.height;

      // Get the canvas context
      const ctx = canvas.getContext('2d');

      // Draw the certificate image on the canvas
      ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);

      // Set the text style for the overlayed text
      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';

      // Draw the project name and owner on the canvas
      ctx.fillText(projectName, canvas.width / 2, canvas.height - 190);
      ctx.fillText(projectOwner, canvas.width / 2, canvas.height - 350);

      // Create a temporary link and set the download attribute
      const link = document.createElement('a');
      link.download = 'certificate.png';

      // Convert the canvas to a data URL and set it as the href of the link
      link.href = canvas.toDataURL('image/png');

      // Trigger a click event on the link to start the download
      link.click();
    }

    function showProjectDetails() {
      document.getElementById('image-container-certificate').style.display = 'block';
      document.getElementById('downloadCertBtn').style.display = 'block';
    }

  });


});

const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', logout);

function logout() {
  window.location.href = '/'; // Replace 'login.html' with the actual login page URL
}