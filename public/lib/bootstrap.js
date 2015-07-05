
var Jinx;
(function(base) {
	var load = function(b, c) {
		var a = 0;
		var run = function() {
			if (a < b.length) {
				console.log('loading: ' + b[a])
				requirejs([b[a]], function() { a += 1; run(); });
			} else {
				c();
			}
		}
		run();
	}
	/* --------------------- */
	
	var loadEvent = {
		_waiting: {
			files: false,
			storage: false,
		},
		_fired: false,
		_event: new Event('jinxLoaded'),
		update: function(k) {
			if (this._fired) {
				return (true);
			}
			
			this._waiting[k] = true;
			console.log(this._waiting);
			for (var i in this._waiting) {
				if (this._waiting[i] == false) {
					return (false);
				}
			}
			
			console.log('sent event loaded');
			var app = Jinx.$data.app || (Jinx.$data.app = {});
			app.loaded = true;
			document.dispatchEvent(this._event);
			return (true);
		}
	}
	
			
	var stored = function($cookies, $rootScope) { // this is the local database thing
		this._cookies = $cookies;
		this._rootScope = $rootScope;
		this._init = false;
		this.s = {};
		this.Init();
	}
	stored.prototype = {
		Init: function() {
			if (this._init) {
				return (true);
			}
			var self = this;
			try {
				self.s = JSON.parse(self._cookies.jinxStored);
			} catch (e) {
				self._cookies.jinxStored = JSON.stringify(self.s);	
			}
			this._init = true;
			console.log('Jinx.$storage has been loadeds');
			loadEvent.update('storage');
		},
		Save: function() {
			this._cookies.jinxStored = JSON.stringify(this.s);
			this._rootScope.$digest();
		}
	}
	
	// add stuff to the load list (runnes before angular bootstrap)
	var _waitingrun = [];
	base.$add = function(a) {
		_waitingrun.push(a);
	}
	
	// init the app with a layer
	var _app = function(name, module) {
		this._controller = angular.module(name + 'Controllers', []);
		this._directive = angular.module(name + 'Directive', []);
		module.push(name + 'Controllers');
		module.push(name + 'Directive');
		this._name = name;
		this._app = angular.module(name, module);
	}
	_app.prototype = {
		Load: function(b, c) {
			var self = this;
			var _call = function() {
				for (var i in _waitingrun) {
					var func = _waitingrun[i](base);
					func(self);
				}
				c();	
				angular.element(document).ready(function() {
					angular.bootstrap(document, [self._name]);
				});
				loadEvent.update('files');
			}
			load(b, _call);
			return (this);
		},
		Config: function(query) {
			return (this._app.config(query));
		}, 
		Controller: function(name, query) {
			return (this._controller.controller(name, query));
		},
		Directive: function(name, query) {
			return (this._directive.directive(name, query));
		},
		Storage: function($cookie, $rootScope) {
			console.log($cookie);
			base.$data = { 
				ingredient: null,
				app: {loaded: false},
			};
			base.$storage = new stored($cookie, $rootScope);
			return (base.$stored);
		}
	};
	
	// load files
	var obj = function(appName, modules, callback) {
		var self = this;
		this._module = [];
		this._file = [];
		for (var i in modules) {
			this._module.push(i);
			this._file.push(modules[i]);
		}
		this.load(this._file, function() {
			self.app = new _app(appName, self._module);
			callback(self.app);
		})
	}
	obj.prototype = {
		load: function(b, c) {
			load(b, c);
			return (this);
		}
	}
	base.Bootstrap = function(lib, appName, modules, callback) {
		return (new obj(lib, appName, modules, callback));
	};
})(Jinx || (Jinx = {}));