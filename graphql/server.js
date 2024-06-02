const express = require('express');
const path = require('path');
const { createHandler } = require('graphql-http/lib/use/express');
const fs = require('fs');
const schema = require('./schema');
const resolvers = require('./resolvers');

const PORT = 5225;
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Static file serving
app.use(express.static(path.join(__dirname, '../css')));

// GraphQL endpoint
app.use('/graphql', createHandler({ schema, rootValue: resolvers }));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Load users from db.json
function loadUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return [];
  }
}

// Save users to db.json
function saveUsers(users) {
  try {
    fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// Initialize users
const users = loadUsers();
resolvers.initUsers(users);

// Endpoint to add user
app.post('/add-user', (req, res) => {
  const { name, age } = req.body;
  const query = `
    mutation {
      addUser(name: "${name}", age: ${age}) {
        id
        name
        age
      }
    }
  `;

  fetch('http://localhost:' + PORT + '/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        console.error(data.errors);
        res.json({ success: false });
      } else {
        const users = loadUsers();
        users.push(data.data.addUser);
        saveUsers(users);
        res.json({ success: true });
      }
    })
    .catch(error => {
      console.error(error);
      res.json({ success: false });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}...`);
});