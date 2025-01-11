const express = require('express');
const path = require('path');
const graphqlRoutes = require('./routes/graphql');
const usuarioRoutes = require('./routes/user');

const PORT = 5225;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/graphql', graphqlRoutes);
app.use('/usuario', usuarioRoutes);

app.get('/graphiql', (req, res) => {
  res.redirect('/graphql/playground');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/view/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}...`);
});