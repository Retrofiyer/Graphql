const fs = require('fs');
const path = require('path');

function loadUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

module.exports = {
  loadUsers,
  saveUsers
};