let users = [];

const resolvers = {
  initUsers: (initialUsers) => {
    users = initialUsers;
  },
  age: () => 30,
  user: ({ id }) => users.find(user => user.id === id),
  users: () => users,
  addUser: ({ name, age }) => {
    const user = { id: `${users.length + 1}`, name, age };
    users.push(user);
    return user;
  },
};
module.exports = resolvers;