var now = process.hrtime;

var GameList = function() {
  var allGames = {};
  var totalGames = 0;
  var wonGames = 0;

  this.add = (id, game) => {
    allGames.id = {
      game,
      lastActiveAt: now()
    };
  };

  this.get = (id) => {
    var obj = allGames.id;
    if (obj) {
      obj.lastActiveAt = now()
      return obj.game;
    }
  }

  this.delete = (id) => {
    delete allGames.id;
  }

  this.incrementWonGame = () => {
    wonGames += 1;
  }

  this.getWonGames = () => {
    return wonGames;
  }

  this.incrementTotalGame = () => {
    totalGames += 1;
  }

  this.getTotalGames = () => {
    return totalGames;
  }

  setInterval(() => {
    for (obj in allGames) {
      if (now(obj.lastActiveAt)[0] > 30000) this.delete(obj);
    }
  }, 50000);
};

module.exports = GameList;
