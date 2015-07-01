Jinx.$add(function() {
	"use strict";

	return (function(app) {
		app.Controller('HomeCtrl', ['$scope', '$timeout', function($scope, $timeout) {
			$scope.home = {}
			
			$('.jinxFaidIn').css({'opacity': 1});
			$timeout(function() {
				$('#Dragdown').css({'margin-top': '5%'});
			}, 250);
		}]);
	});	
});