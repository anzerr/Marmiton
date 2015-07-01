var Jinx;
(function(base) {
	requirejs([ // add libs here
		'/public/lib/jquery-2.1.4.js',
		'/public/lib/socket.js',
		'/public/lib/bootstrap.js', // not style this is this app bootstrap
		'/public/lib/angular/angular.js',
	], function(util) {
		base.Bootstrap('Marmiton', { // angular modules here
			ngRoute: '/public/lib/angular/angular-route.js',
			ngCookies: '/public/lib/angular/angular-cookies.js',
			ngAnimate: '/public/lib/angular/angular-animate.js',
		}, function(app) {

			app.Load([ // add all the files needs to load
				'/public/content/js/bootstrap.min.js', // loaded here because it needs jquery
				'/public/app/controller/home.js',
				'/public/app/directive/dropzone.js',
				'/public/app/directive/menu.js',
			], function() {				
				// route config 
				app.Config(['$routeProvider', function($routeProvider) {
					console.log('route');
					$routeProvider.
					when('/home', {
						templateUrl: '/public/app/partials/home.html',
						controller: 'HomeCtrl'
					}).
					when('/show', {
						template: '<div>show</div>',
						controller: 'ShowCtrl'
					}).
					otherwise({
						redirectTo: '/home'
					});
				}]).run(['$cookies', '$rootScope', '$location', '$timeout', function($cookies, $rootScope, $location, $timeout) {
					$rootScope.$on('$routeChangeStart', function(event, next, current) { // stuff on every route change
						// stuff
					});
					$rootScope.$on('$routeChangeSuccess', function(event, next, current) {
						$timeout(function() {
							if ($location.$$url != '/home') {
								$('.jinxFaidIn').css({'opacity': 1});
							}
							base.collapsMenu.show();
						}, 250);
					});
					app.Storage($cookies, $rootScope); // load the base $storage object and $data (perm, temp)
				}]);
			});// bootstrap project happends after this call back
			
							
			document.addEventListener('jinxLoaded', function (e) {
				console.log('done');
				$('.loadingBlock').css({'pointer-events': 'none', 'opacity': 0});
			}, false);
		});
	});
})(Jinx || (Jinx = {}));