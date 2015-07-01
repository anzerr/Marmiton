
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
	
	
	// easy use of the socket in controllers and directives
	/*
		socket.send(JSON.stringify({
			route: '/player/1/setname',
			param: {cat:'dog', id:11},
		}));
	*/
	var ws = function(ip, port) {
		var self = this;
		this._info = {ip: ip, port: port};
		this._socket = new WsObj('ws://' + ip + ':' + port);
		this._socket.on('message', function(msg) {
			self.route(msg);
		})
	}
	ws.prototype = {
		route: function(data) {
			var parse = null;
			try {
				parse = JSON.parse(data);
				if (!isset(parse.route) || !isset(this._on[parse.route])) {
					console.log('error: missing route:"' +parse.route+ '" or nothing binded.');
					return (false);
				}
			} catch (e) {
				console.log('error: ws message is not JSON.');
				return (false);
			}
			
			for (var i in this._on[parse.route]) {
				this._on[parse.route][i](parse.data);
			}
		},
		_on: {},
		on: function(event, callback) {
			var obj = this._on[event] || (this._on[event] = []);
			obj.push(callback);
		},
		send: function(a) { // maybe add return a error or a callback? (in case it disconnects or server crash);
			this._socket.send(JSON.stringify(a));
		}
	}
	base.$ws = new ws('127.0.0.1', 8080);
	
	
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
					var func = _waitingrun[i]();
					func(self);
				}
				c();					
				angular.element(document).ready(function() {
					angular.bootstrap(document, [self._name]);
				});
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