Jinx.$add(function() {
	"use strict";

	Jinx.collapsMenu = {
		status: false,
		_show: null,
		init: function() {
			var self = this;
			this.menu = $('.jinxMenu');
			this.view = $('.jinxView');
			this.button = $('.jinxCollaps').on('click', function() {
				self.menu.css('left', (self.status) ? '-200px' : '0px');
				self.view.css('margin-left', (self.status) ? '0px' : '200px');
				self.status = !self.status;
			});
		},
		hide: function() {
			if (this._show != false) {
				this._show = false;
				this.menu = $('.jinxMenu');
				this.view = $('.jinxView');
				console.log('hidden');
				this.menu.css('left', '-232px');
				this.view.css('margin-left', '0px');
				this.status = false;
			}
		},
		show: function() {
			if (this._show != true) {
				this._show = true;
				this.menu = $('.jinxMenu');
				this.view = $('.jinxView');
				console.log('show');
				this.menu.css('left', '-200px');
				this.view.css('margin-left', '0px');
				this.status = false;
			}
		},
	};
	
	var obj = {
		home: function() {},
	};
	
	return (function(app) {
		app.Directive('jinxMenu', ['$timeout', '$http', '$location', function($timeout, $http, $location) {
			var link = function(scope, element, attrs) {
				scope.sidemenu = {
					Logout: function() {
						
					}
				}
				
				$timeout(function() {
					Jinx.collapsMenu.init();
				});
				
				obj.home = function() { 
					if ($location.$$url != '/home') {
						$location.path( "/home" );
					} else {
						Jinx.collapsMenu.hide();
					}
				}
			}
			
			return {
				restrict: 'E',
				templateUrl: '/public/app/partials/menu.html',
				link: link,
			};
		}]);
	});
});