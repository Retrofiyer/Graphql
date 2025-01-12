const graphQLFetcher = (graphQLParams) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then((response) => response.json());
};

document.getElementById('addUserForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value, 10);

  const query = `
    mutation {
      addUser(name: "${name}", age: ${age}) {
        id
        name
        age
      }
    }
  `;

  graphQLFetcher({ query })
    .then((data) => {
      if (data.errors) {
        console.error(data.errors);
        alert('Error adding user');
      } else {
        alert('User successfully added');
        document.getElementById('addUserForm').reset();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error adding user');
    });
});

document.getElementById('loadUsersButton').addEventListener('click', function () {
  const query = `
    query {
      users {
        id
        name
        age
      }
    }
  `;

  graphQLFetcher({ query })
    .then((data) => {
      const userList = document.getElementById('userList');
      userList.innerHTML = '';
      data.data.users.forEach((user) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${user.name} (${user.age})`;
        userList.appendChild(listItem);
      });
    })
    .catch((error) => console.error('Error loading users:', error));
});