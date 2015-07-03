Jinx.$add(function() {
	"use strict";

	return (function(app) {
		app.Controller('HomeCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
			$scope.home = {
				_insert: {
					id: null,
				},
				_edit: [],
				_wait: false,
				result: [],
				Get: function() {
					var self = this;
					self._wait = true;
					$http({
						method: 'post', url: '/', data: {
							c: 'ingredient', 
							a: 'get', 
							p: {}
						}
					}).success(function(data, status, headers, config) {
						self.result = data;
						self._wait = false;
					}).error(function(data, status, headers, config) {
						console.log(data);
					});
				},
				Add: function(v) {
					var self = this;
					self._wait = true;
					$http({
						method: 'post', url: '/', data: {
							c: 'ingredient', 
							a: 'create', 
							p: {'value': v}
						}
					}).success(function(data, status, headers, config) {
						self.Get();
					}).error(function(data, status, headers, config) {
						console.log(data);
					});
				},
				_editstat: {},
				Edit: function(id) {
					var self = this;
					self._edit[id] = !self._edit[id];
					if (!self._edit[id]) {
						var same = true;
						for (var i in self._editstat[id]) {
							if (self._editstat[id][i] != self.result[id][i]) {
								same = false;
								break;
							}
						}
						if (same) {
							console.log('no change done on ' + id);
							return (false);
						}
						
						self._wait = true;
						$http({
							method: 'post', url: '/', data: {
								c: 'ingredient', 
								a: 'update', 
								p: {'id': self.result[id].id, 'value': self.result[id]}
							}
						}).success(function(data, status, headers, config) {
							self.Get();
						}).error(function(data, status, headers, config) {
							console.log(data);
						});
					} else {
						var save = {};
						for (var i in self.result[id]) {
							save[i] = self.result[id][i];
						}
						self._editstat[id] = save;
					}
				},
				Remove: function(id) {
					var self = this;
					self._wait = true;
					$http({
						method: 'post', url: '/', data: {
							c: 'ingredient', 
							a: 'delete', 
							p: {'id': self.result[id].id}
						}
					}).success(function(data, status, headers, config) {
						self.Get();
					}).error(function(data, status, headers, config) {
						console.log(data);
					});
				}
			}
			
			$scope.home.Get();
			$('.jinxFaidIn').css({'opacity': 1});
			$timeout(function() {
				$('#Dragdown').css({'margin-top': '5%'});
			}, 250);
		}]);
	});	
});