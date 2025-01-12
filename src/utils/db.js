const fs = require('fs');
const path = require('path');

function loadUsers() {
  const filePath = path.join(__dirname, '../db/db.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

module.exports = { loadUsers };

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