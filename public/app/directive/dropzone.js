Jinx.$add(function() {
	"use strict";

    var tests = {
        filereader: typeof(FileReader) !== 'undefined',
        dnd: 'draggable' in document.createElement('span'),
        formdata: !!(window.FormData),
        progress: "upload" in new XMLHttpRequest
    },
    acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };

    /*var _thing = ['filereader', 'formdata', 'progress'];
    for (var i in _thing) {

        if (tests[api] === false) {
            support[api].className = 'fail';
        } else {
            // FFS. I could have done el.hidden = true, but IE doesn't support
            // hidden, so I tried to create a polyfill that would extend the
            // Element.prototype, but then IE10 doesn't even give me access
            // to the Element object. Brilliant.
            support[api].className = 'hidden';
        }
    }*/

    var previewfile = function(file) {
        if (tests.filereader === true && acceptedTypes[file.type] === true) {
            var reader = new FileReader();
            reader.onload = function (event) {
                /*var image = new Image();
                image.src = event.target.result;
                image.width = 250;*/
            };
            reader.readAsDataURL(file);
        }
    };

    var readfiles = function(files) {
        var formData = tests.formdata ? new FormData() : null;
        for (var i = 0; i < files.length; i++) {
            if (tests.formdata) {
                formData.append('file', files[i]);
            }
            previewfile(files[i]);
        }

        // now post a new XHR request
        if (tests.formdata) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/devnull.php');
            xhr.onload = function() {
                console.log('done?');
            };

            if (tests.progress) {
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        //var complete = (event.loaded / event.total * 100 | 0);
                        //progress.value = progress.innerHTML = complete;
                        console.log(event.loaded, event.total);
                    }
                }
            }

            xhr.send(formData);
        }
    };

	var link = function (scope, elem) {
		elem.bind('dragover', cancal);
		elem.bind('dragenter', cancal);
		elem.bind('drop', function(e) {
            e.preventDefault();
            readfiles(e.dataTransfer.files);
		});
	};
	
	return (function(app) {
		app.Directive("jinxDropzone", function() {
			return {
				restrict: "A",
				link: link,
			}
		});
	});
});

