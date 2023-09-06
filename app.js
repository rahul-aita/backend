const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonServer = require('json-server'); // Import json-server

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');


// Define your routes here (before json-server middleware)

app.get('/employee', (req, res) => {
  const users = JSON.parse(fs.readFileSync('emp.json')).employee;
  res.render('employee', { data: users });
});

app.get('/', (req, res) => {
  res.redirect('/employee'); // Redirect to '/employee' instead of '/emp.json'
});

// Create a json-server instance and configure routes
const jsonServerMiddleware = jsonServer.router('emp.json');
app.use('/api', jsonServerMiddleware); // Mount json-server at the /api path
//post req

app.post('/emp', (req, res) => {
    // Read the existing data from emp.json
    const existingData = JSON.parse(fs.readFileSync('emp.json')).employee;
  
    // Check if the 'employee' property exists in the existing data, and initialize it if it doesn't
    if (!existingData.employee) {
      existingData.employee = [];
    }
  
    // Create a new employee object
    const emp = {
      id: Date.now(),
      name: req.body.employeeName,
      department: req.body.department,
      salary: req.body.salary
    };
  
    // Push the new employee object to the 'employee' array
    existingData.employee.push(emp);
  
    // Write the updated data back to emp.json
    fs.writeFileSync('emp.json', JSON.stringify(existingData));
  
    res.redirect('/employee');
  });
  
  app.get('/delete/:id', (req, res) => {
    const existingData = JSON.parse(fs.readFileSync('emp.json')).employee;
    
    // Find the index of the user with the specified ID
    const userIndex = existingData.findIndex((u) => u.id === parseInt(req.params.id));
    
    // Check if the user was found
    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }
  
    // Remove the user from the array using splice
    existingData.splice(userIndex, 1);
  
    // Write the updated data back to emp.json
    fs.writeFileSync('emp.json', JSON.stringify({ employee: existingData }));
  
    res.redirect('/employee');
  });
  
  app.get('/edit/:id', (req, res) => {
    const existingData = JSON.parse(fs.readFileSync('emp.json')).employee;
    const userIndex = existingData.findIndex((u) => u.id === parseInt(req.params.id));
  
    // Check if the user was found
    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }
  
    const userData = existingData[userIndex]; // Get the user data by index
  
    res.render('edit', { data: existingData, userData: userData });
  });
  

app.listen(5000, () => {
  console.log('App is listening on port 5000');
});
