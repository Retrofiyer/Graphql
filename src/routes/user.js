const express = require('express');
const fetch = require('node-fetch');
const { loadUsers, saveUsers } = require('../utils/db');

const router = require('express').Router();
const PORT = 5225;

router.post('/', async (req, res) => {
  const fetch = (await import('node-fetch')).default;
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

  try {
    const response = await fetch(`http://localhost:${PORT}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error(data.errors);
      res.json({ success: false });
    } else {
      const users = loadUsers();
      users.push(data.data.addUser);
      saveUsers(users);
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

module.exports = router;