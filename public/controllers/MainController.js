app.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.guesses = [];
  $scope.letters = [];
  $scope.keyPressed = 0;

  $scope.displayName = false;
  $scope.playAgain = false;

  $scope.totalGames = 0;
  $scope.wonGames = 0;

  $scope.inProgress = function() {
    return $scope.status === 1;
  };

  $scope.won = function() {
    return $scope.status === 2;
  };

  $scope.lost = function() {
    return $scope.status === 3;
  };

  angular.element(document.getElementById('kb')).triggerHandler('keyPressed');

  $scope.request = function(url, data, callback) {
    return $http.post(url, data).then(function(res) {
      if (res.data.success) callback(res.data);
      else $scope.error = res.data.error;
      return res.data;
    }).catch(function(e) {
      $scope.error = 'Ops something went wrong!';
    });
  };

  $scope.hasGuessed = function(letter) {
    return $scope.guesses.indexOf(letter) >= 0;
  }

  $scope.cssForLetter = function(letter) {
    if ($scope.letters.indexOf(letter) >= 0) return 'btn-success';
    if ($scope.guesses.indexOf(letter) >= 0) return 'btn-danger';
    return 'btn-primary';
  }

  $scope.refresh = function(data) {
    $scope.id = data.id;
    $scope.word = data.word;
    $scope.status = data.status;
    $scope.guesses = data.guesses;
    $scope.letters = data.letters.join(' ');
    $scope.remainingMissesCount = data.remainingMissesCount;
    $scope.error = undefined;
    $scope.totalGames = data.totalGames;
    $scope.wonGames = data.wonGames;
    draw($scope.remainingMissesCount);
    return data;
  };

  $scope.startNewGame = function() {
    if (!$scope.myName) $scope.myName = "Anonymous Person";
    $scope.request('/new', { id: $scope.id, name: $scope.myName },
    $scope.refresh).then(function() {
      $scope.displayName = true;
      $scope.playAgain = true;
    });
  };

  $scope.guessLetter = function(letter, $event) {
    $scope.request('/guess', { id: $scope.id, letter: letter, name: $scope.myName },
    $scope.refresh);
  };

  $scope.onKeyPress = function($event) {
    if ($scope.inProgress()) {
      var letter = String.fromCharCode($event.keyCode);
      $scope.guessLetter(letter);
    }
  };
}]);

var draw = function(remainingMissesCount) {
  var canvas = document.getElementById('hangman');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 200)';

    switch(remainingMissesCount) {
      case 9:    // bottom
          ctx.fillRect(50, 205, 500, 5);
          break;

      case 8:    // vertical
          ctx.fillRect(100, 10, 100, 5);
          break;

      case 7:    // horizontal
          ctx.fillRect(100, 10, 5, 200);
          break;

      case 6:    // string
          ctx.fillRect(200, 10, 5, 40);
          break;

      case 5:    // head
          ctx.beginPath();
          ctx.arc(200, 70, 20, 0, Math.PI * 2, true);
          ctx.stroke();
          break;

      case 4:    // body
          ctx.moveTo(200, 90);
          ctx.lineTo(200, 140);
          ctx.stroke();
          break;

      case 3:    // left arm
          ctx.moveTo(200, 110);
          ctx.lineTo(160, 90);
          ctx.stroke();
          break;

      case 2:    // right arm
          ctx.moveTo(200, 110);
          ctx.lineTo(240, 90);
          ctx.stroke();
          break;

      case 1:    // left foot
          ctx.moveTo(200, 140);
          ctx.lineTo(170, 170);
          ctx.stroke();
          break;

      case 0:    // right foot
          ctx.moveTo(200, 140);
          ctx.lineTo(230, 170);
          ctx.stroke();
          ctx.closePath();
          break;

      default: return;
    }
  }
};
