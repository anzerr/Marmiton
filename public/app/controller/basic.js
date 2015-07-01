Jinx.$add(function() {
	"use strict";

	/* objects and static stuff here
	
		----------------------------
	*/
	
	// exemple stuff
	return (function(app) {
		app.Controller('ShowCtrl', ['$scope', function($scope) {
			console.log("show");
		}]);
	});	
});