Jinx.$add(function() {
	"use strict";

	var link = function (scope, elem) {
		elem.bind('dragover', cancal);
		elem.bind('dragenter', cancal);
		elem.bind('drop', function(evt) {
			evt.stopPropagation();
			evt.preventDefault();

			var files = evt.dataTransfer.files;
			for (var i = 0, f; f = files[i]; i++) {
				var reader = new FileReader();
				reader.readAsText(f);
				
				reader.onload = (function(theFile) {
					return function(e) {
						scope.import.add({
							name: ['name'],
							data: {	
								name: theFile.name,
								content: reader.result,
							}
						});
					};
				})(f);
			}
		});
	}
	
	return (function(app) {
		app.Directive("jinxDropzone", function() {
			return {
				restrict: "A",
				link: link,
			}
		});
	});
});