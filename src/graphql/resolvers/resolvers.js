let users = [];

const resolvers = {
  initUsers: (initialUsers) => {
    users = initialUsers;
  },
  users: () => users,
  addUser: ({ name, age }) => {
    const newUser = { id: `${users.length + 1}`, name, age };
    users.push(newUser);
    return newUser;
  },
};

module.exports = resolvers;