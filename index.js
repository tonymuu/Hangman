var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var Hangman = require('./app/hangman.js');
var GameList = require('./app/gamelist.js');
var UserList = require('./app/userlist.js');
// var games = new GameList();
var users = new UserList();
//var options = require('');
var uuid = require('node-uuid');

app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index.pug');
});

app.use((err, req, res, next) => {
  res.json({ success: false, id: req.body.id, error: err.message });
});

app.post('/new', (req, res) => {
  var id = uuid.v4();
  var game = new Hangman();
  var name = req.body.name;
  if (!users.get(name)) users.add(name, new GameList());
  var games = users.get(name);
  games.add(id, game);
  games.incrementTotalGame();
  res.json(currentState(name, id));
});

app.post('/guess', (req, res) => {
  var games = users.get(req.body.name);
  var game = games.get(req.body.id);
  if (game) game.guess(req.body.letter);
  res.json(currentState(req.body.name, req.body.id));
});

app.listen(8080, (err) => {
  if (err) throw err;
  process.stdout.write('Running at port 8080');
});

var currentState = function(name, id) {
  console.log(users.getAll());
  var games = users.get(name);
  if (!games) return { success: false, id, error: 'No such user exists' };
  var game = games.get(id);
  if (!game) return { success: false, id, error: 'No such game exists' };
  var gameStatus = game.getStatus();
  if (gameStatus === Hangman.Status.Won) games.incrementWonGame();
  var response = {
    success: true,
    id,
    status: gameStatus,
    letters: game.getLetters(),
    guesses: game.getGuesses(),
    remainingMissesCount: game.getRemainingMissesCount(),
    word: gameStatus === Hangman.Status.InProgress ? undefined : game.getWord(),
    totalGames: games.getTotalGames(),
    wonGames: games.getWonGames()
  };
  return response;
}
