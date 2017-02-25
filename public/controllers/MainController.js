app.controller('MainController', ['$scope', '$http', function($scope, $http) {
  $scope.guesses = [];
  $scope.letters = [];

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
    return data;
  };

  $scope.startNewGame = function() {
    if (!$scope.myName) $scope.myName = "Anonymous Person";
    console.log($scope.myName);
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

}]);
