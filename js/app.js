angular.module('gChat', ["firebase"])

.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
})


.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var auth = $firebaseAuth();
    return auth;
  }
])

.factory('google', ["$http", function($http){
  var g= {};

  g.translate = function(m){
    return $http.get({
    url: "https://suggestqueries.google.com/complete/search?client=chrome&q=" + encodeURIComponent(m),
    dataType: "jsonp"
  });
  }

  // g.get = function(m){
  //   return $http.get('https://suggestqueries.google.com/complete/search?client=chrome&q=' + encodeURIComponent(m))
  // }

  return g;
}])

.controller('MainCtrl', [
'$scope',
'google',
'Auth',
'$firebaseArray',
function($scope, google, Auth,  $firebaseArray){
  $scope.message = "";
  $scope.messages = [];
  $scope.suggestions = [];

  var ref = firebase.database().ref().child("messages");

  $scope.messages = $firebaseArray(ref)

  $scope.register = function(){
    $scope.error = null;

    Auth.$createUserWithEmailAndPassword($scope.message, "Testing123").catch(function(error) {
      console.log(error);
    }).then(function(data){
      $scope.message = data;
    });
  }

  var t = 0;

  $scope.test = function(){

    // var promise = new Promise(function(resolve, reject) {
    //   $.ajax({
    //     url: "https://suggestqueries.google.com/complete/search?client=chrome&q=" + encodeURIComponent($scope.message),
    //     dataType: "jsonp"
    //   }).done(function(data) {
    //     var rawResults = data[1].slice(0, 3);
    //     //alert("hello");
    //     $scope.suggestions = rawResults;
    //   }).fail(function(jqXHR, textStatus) {
    //     return null;
    //   });
    // });

    if( t%2 == 0){
      $scope.messages.$add({
        text: $scope.message,
        from: "you"
      });
    }
    else{
      $scope.messages.$add({
        text: $scope.message,
        from: "them"
      });
    }
    t++;
    $scope.message = "";

  }

}]);
