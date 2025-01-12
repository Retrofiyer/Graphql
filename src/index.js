const express = require('express');
const path = require('path');
const graphqlHandler = require('./routes/graphql');
const userRoutes = require('./routes/user');
const resolvers = require('./graphql/resolvers/resolvers');
const { loadUsers } = require('./utils/db');

const PORT = 5225;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const initialUsers = loadUsers();
resolvers.initUsers(initialUsers);

app.use('/graphql', graphqlHandler);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/view/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});