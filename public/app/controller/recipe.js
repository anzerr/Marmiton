Jinx.$add(function() {
	"use strict";
	
	var slashEdit = function($timeout, b) {
		$('input:text, textarea').addClass('transitionAllB').css({
			'border': '1px solid ' + ((b) ? '#DFF2BF' : '#FEEFB3'), 
			'color': ((b) ? '#4F8A10' : '#9F6000')
		});
		$timeout(function() {
			$('input:text, textarea').css({'border': '1px solid #ccc', 'color': 'black'});
		}, 500);
	}

	return (function(app) {
		app.Controller('RecipeCtrl', ['$scope', '$timeout', '$http', '$routeParams', '$location', function($scope, $timeout, $http, $routeParams, $location) {
			$scope.home = {
				_insert: {
					id: null,
					enable: true,
                    image: null,
                    note: 0,
                    numberVote: 0
				},
				_head: ['id', 'name', 'instruction', 'description', 'image', 'note', 'numberVote', 'enable'],
				_edit: [],
				_wait: false,
				_id: $routeParams.id,
				result: [],
				_search: '',
				_backup: [],
				Search: function() {
					var self = this;
					if (self._search === '') {
						self._hide = [];
					} else {
						self._hide = [];
						for (var i in self._backup) {
							var str = self._backup[i].name +' '+ self._backup[i].instruction +' '+ self._backup[i].description
							if (str.match(new RegExp(self._search, 'gi')) === null) {
								self._hide[i] = true;
							}
						}
					}
				},
				
				_vote: false,
				Vote: function(edit, star) {
					var self = this;
					if (!self._vote) {
						self._vote = true;
						edit.note += star;
						edit.numberVote += 1;
						$http({
							method: 'post', url: '/', data: {
								c: 'recipe', 
								a: 'update', 
								p: {'id': $routeParams.id, 'value': edit}
							}
						}).success(function(data, status, headers, config) {
							self.Get($routeParams.id);
						}).error(function(data, status, headers, config) {
							console.log(data);
						});
					}
				},
				
				Get: function(id, callback) {
					var self = this;
					self._wait = true;
					var p = (isset(id)) ? {id: id} : {};
					$http({
						method: 'post', url: '/', data: {
							c: 'recipe', 
							a: 'get', 
							p: p
						}
					}).success(function(data, status, headers, config) {
						self.result = data;
						self._backup = data;
						if (isset(callback)) {
							callback();
						}
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
							c: 'recipe', 
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
								c: 'recipe', 
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
				Save: function(edit) {
					var self = this;
					
					self._wait = true;
					$http({
						method: 'post', url: '/', data: {
							c: 'recipe', 
							a: 'update', 
							p: {'id': edit.id, 'value': edit}
						}
					}).success(function(data, status, headers, config) {
						slashEdit($timeout, true);
						self.Get(self._id);
					}).error(function(data, status, headers, config) {
						console.log(data);
					});
				},
				Remove: function(id) {
					var self = this;
					self._wait = true;
					$http({
						method: 'post', url: '/', data: {
							c: 'recipe', 
							a: 'delete', 
							p: {'id': self.result[id].id}
						}
					}).success(function(data, status, headers, config) {
						self.Get();
					}).error(function(data, status, headers, config) {
						console.log(data);
					});
				},
				comment: {
					result: [{email:'cat@cat.com', date:100, comment:'nice cat'}],
					_insert: {},
					Get: function(id) {
						var self = this;
						$scope.home._wait = true;
						$http({
							method: 'post', url: '/', data: {
								c: 'comment', 
								a: 'get', 
								p: {recipeId: $routeParams.id}
							}
						}).success(function(data, status, headers, config) {
							self.result = data;
							self._wait = false;
						}).error(function(data, status, headers, config) {
							console.log(data);
						});	
					},
					Add: function(obj) {
						var self = this;
						$scope.home._wait = true;
						$http({
							method: 'post', url: '/', data: {
								c: 'comment', 
								a: 'create', 
								p: {'value': {
									id: null, 
									recipeId: $routeParams.id, 
									email: obj.user, 
									comment: obj.text,
									date: new Date()
								}}
							}
						}).success(function(data, status, headers, config) {
							self._insert = {id: null};
							self.Get($routeParams.id);
							$scope.home._wait = false;
						}).error(function(data, status, headers, config) {
							console.log(data);
						});
					},
					Remove: function(id) {
						var self = this;
						self._wait = true;
						$http({
							method: 'post', url: '/', data: {
								c: 'comment', 
								a: 'delete', 
								p: {'id': self.result[id].id}
							}
						}).success(function(data, status, headers, config) {
							self.Get();
						}).error(function(data, status, headers, config) {
							console.log(data);
						});
					},
				},
				ingredient: {
					_insert: {
						id: null,
					},
					_head: ['id', 'ingredient', 'amount'],
					_all: [],
					result: [],
					_edit: [],
					_get: function(id) {						
						for (var i in this._all) {
							if (this._all[i].id === id) {
								return (this._all[i].name);
							}
						}
						return ('NULL');
					},
					Add: function(id) {
						var self = this;
						$scope.home._wait = true;
						console.log(id);
						$http({
							method: 'post', url: '/', data: {
								c: 'reciperow', 
								a: 'create', 
								p: {'value': {
									id: null, 
									recipeId: $routeParams.id, 
									ingredientId: id.name, 
									amount: id.amount
								}}
							}
						}).success(function(data, status, headers, config) {
							self._insert = {id: null};
							self.Get($routeParams.id);
							$scope.home._wait = false;
						}).error(function(data, status, headers, config) {
							console.log(data);
						});
					},
					Remove: function(id) {
						var self = this;
						self._wait = true;
						$http({
							method: 'post', url: '/', data: {
								c: 'reciperow', 
								a: 'delete', 
								p: {'id': self.result[id].id}
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
									c: 'reciperow', 
									a: 'update', 
									p: {'id': self.result[id].id, 'value': {
										id: self.result[id].id,
										amount: self.result[id].amount,
										ingredientId: self.result[id].ingredientId,
										recipeId: self.result[id].recipeId
									}}
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
					Get: function(id) {
						var self = this;
						$scope.home._wait = true;
						$http({
							method: 'post', url: '/', data: {
								c: 'reciperow', 
								a: 'get', 
								p: {recipeId: id}
							}
						}).success(function(data, status, headers, config) {
							self.result = data;
							for (var i in self.result) {
								self.result[i].ingredient = self._get(self.result[i].ingredientId);
							}
							$scope.home._wait = false;
						}).error(function(data, status, headers, config) {
							console.log(data);
						});
					},
				}
			}
			
			if (!isset(Jinx.$data.ingredient)) {
				$http({
					method: 'post', url: '/', data: {
						c: 'ingredient', 
						a: 'get', 
						p: {}
					}
				}).success(function(data, status, headers, config) {
					$scope.home.ingredient._all = (Jinx.$data.ingredient = data);
				}).error(function(data, status, headers, config) {
					console.log(data);
				});
			} else {
				$scope.home.ingredient._all = Jinx.$data.ingredient;
			}
			
			$scope.home.Get($routeParams.id, function() {
				if ($location.$$path.match(/(edit|view)\/[0-9]+/i) !== null) {
					$scope.home.ingredient.Get($routeParams.id);
					$scope.home.comment.Get($routeParams.id);
				}
			});
			$('.jinxFaidIn').css({'opacity': 1});
			$timeout(function() {
				$('#Dragdown').css({'margin-top': '1%', 'opacity': 1});
			}, 250);
		}]);
	});	
});