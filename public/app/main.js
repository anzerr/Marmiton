isset = function(a) { return (typeof(a) !== 'undefined' && a !== null); }

var Jinx;
(function(base) {
    "use strict";

    var partials = '/public/app/partials/';

    base.controller = angular.module('appControllers', [
        'ngCookies',
    ]);

    base.app = angular.module('LiteAdmin',[
        'ngRoute',
        'ngCookies',
        'appControllers'
    ]);

    base.app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: partials + 'home.html',
                controller: 'HomeCtrl'
            }).
            when('/recettes', {
                templateUrl: partials + 'recettes.html',
                controller: 'HomeCtrl'
            }).
            when('/contribute', {
                templateUrl: partials + 'contribute.html',
                controller: 'HomeCtrl'
            }).
            when('/contact', {
                templateUrl: partials + 'contact.html',
                controller: 'HomeCtrl'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);


    // FUNC
    base._connection = {
        s: {
            host: 'localhost',
            user: 'root',
            password: '',
            port: '',
        },
        error: [],
        init: false,
        tested: false,
        Init: function($cookies, $http) {
            if (this.init) {
                return (true);
            }
            var self = this;
            try {
                self.s = JSON.parse($cookies.sqlConfig);
            } catch (e) {
                $cookies.sqlConfig = JSON.stringify(self.s);
            }
            this.init = true;
            this.Test($http);
        },
        Save: function($cookies, $http) {
            $cookies.sqlConfig = JSON.stringify(this.s);
            this.Test($http);
        },
        Test: function($http) {
            var self = this;
            self.tested = false;
            base.query($http, 'SHOW DATABASES;').success(function(res) {
                self.error = res.error;
                self.tested = true;
            });
        },
        Get: function() {
            if (!this.init) {
                return ({});
            }
            return ({
                sql: 'mysql:host=' + this.s.host + ((this.s.port != '') ? ';port=' + this.s.port : ''),
                user: this.s.user,
                pwd: this.s.password,
            });
        }
    }

    base._query = {
        _database:'',
        _pos: 0,
        set:function(a) {
            this._database = a;
        },
        list:[],
        add:function(a, b) {
            if (!isset(this.list[this.list.length - 1]) || this.list[this.list.length - 1].q != a) {
                this.list.push({q:a, d:(isset(b)) ? b : ''});
                this._pos = this.list.length;
            }

            console.log(this.list);
            return (a);
        },
        qGet: function(a) {
            this._pos = Math.min(Math.max(this._pos + a, 0), this.list.length - 1);
            return (this.list[this._pos]);
        }
    }

    base.escapeRegExp = function(str) {
        return (str+'').replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char;
            }
        });
    }

    base.query = function($http, q, d) {
        return ($http({method: 'post', url: '/', data: {c: 'database', a: 'query', p: {connect: base._connection.Get(), query: q, database: (isset(d)) ? d : ''}}}));
    }

})(Jinx || (Jinx = {}));