const express = require('express');
const path = require('path');
const { createHandler } = require('graphql-http/lib/use/express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const fs = require('fs');
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');

const PORT = 5225;
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', createHandler({ schema, rootValue: resolvers }));

app.get('/graphiql', expressPlayground({ endpoint: '/graphql' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/view/index.html'));
});

function loadUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

const users = loadUsers();
resolvers.initUsers(users);

app.post('/usuario', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}...`);
});