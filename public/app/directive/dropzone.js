Jinx.$add(function() {
	"use strict";

	var cancal = function(e) {
		if (e.preventDefault) { e.preventDefault(); }
		return false;	
	}
	
	return (function(app) {
		app.Directive("jinxdropzone", ['$parse', function($parse) {
			return {
				restrict: 'E', //attribute or element
				require: '?ngModel',
				template: '<div class="jinxDropzone">Drop file here</div>',
				//replace: true,
				link: function (scope, elem, attributes, controller) {
					console.log(scope);
					console.log(controller);
					
					elem[0].addEventListener('dragover', cancal);
					elem[0].addEventListener('dragenter', cancal);
					elem[0].addEventListener('drop', function(evt) {
						console.log(evt);
						if (!isset(evt.dataTransfer)) {
							return;
						}
						
						console.log(evt.dataTransfer);
						var files = evt.dataTransfer.files;
						for (var i = 0, f; f = files[i]; i++) {
							var reader = new FileReader();
							reader.readAsDataURL(f);//.readAsText(f);
							
							reader.onload = (function(theFile) {
								return function(e) {
									console.log(attributes['ngModel']);
									var modelGetter = $parse(attributes['ngModel']);
									console.log(modelGetter(scope));

									// This returns a function that lets us set the value of the ng-model binding expression:
									var modelSetter = modelGetter.assign;

									// This is how you can use it to set the value 'bar' on the given scope.
									modelSetter(scope, reader.result);
									
									console.log(modelGetter(scope));
									//ngModelCtrl.$modelValue = reader.result;
									console.log(scope);
									scope.$digest();
								};
							})(f);
						}
						
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					});
				},
			}
		}]);
	});
});

