var UserList = function() {
  var allUsers = {};

  this.add = (name, gameList) => {
    allUsers.name = gameList;
  };

  this.get = (name) => {
    var obj = allUsers.name;
    if (obj) return obj;
  }

  this.delete = (name) => {
    delete allUsers.name;
  }

  this.getAll = () => {
    return allUsers;
  }

};

module.exports = UserList;
