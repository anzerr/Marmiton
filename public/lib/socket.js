var isset = function(e) { return (typeof(e) !== 'undefined' && e !== null); };

var Wait = (function() {
	var loaded = false;
	var cached = [];
	
	window.addEventListener("load", function() {
		for (var i in cached) {
			setTimeout(cached[i].callback, cached[i].time);
		}
		loaded = true;
	}, false);
	
	return (function(c, t) {
		if (loaded) {
			setTimeout(c, t);
		} else {
			cached.push({callback: c, time: t,});
		}
	});
})()

var WsObj = (function(base) {
	
	var cache = {};
	var module = function(ip) {
		this.ip = ip;
		this._run = false;
		this._cache = [];
		this._hook = {
			message: [],
			open: [],
			close: [],
		}
		this.connect();
	};
	module.prototype = {
		connect: function() {
			try {
				console.log('try: ' + this.ip);
				this.socket = new WebSocket(this.ip);
				this.init();
			} catch(e) {
				Wait(this.connect, 1000);
			}
		},
		init: function() {
			var self = this;
			this.socket.onopen = function() { self._open(self); }
			this.socket.onclose = function() { self._close(self); }
			this.socket.onerror = function() { self._error(self); }
			this.socket.onmessage = function(m) { self._message(m, self); }
		},
		send: function(data) {
			if (this._run) {
				try {
					this.socket.send(data)
				} catch(e) {
					console.log('error: ', e);
				}
			} else {
				this._cache.push(data);
			}
		},
		close: function() {
			this.socket.close();
		},
		on: function(hook, callback) {
			this._hook[hook].push(callback);
		},
		
		_qsend: function() {
			for (var i in this._cache) {
				this.socket.send(this._cache[i]);
			}
			this._cache = [];
		},
		_open: function() {
			this._run = true;
			this._qsend();
			var a = this._hook.open;
			for (var i in a) {
				a[i]();
			}
			console.log("open");
		},
		_close: function() {
			this._run = false;
			var a = this._hook.close;
			for (var i in a) {
				a[i]();
			}
			console.log("close");
		},
		_error: function() {
			console.log("error");
		},
		_message: function(msg, self) {
			var a = this._hook.message;
			for (var i in a) {
				a[i](msg);
			}
		},
	};
	
	return (module);
})()