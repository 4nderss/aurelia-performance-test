var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    var App = (function () {
        function App(client, taskQueue) {
            this.client = client;
            this.taskQueue = taskQueue;
            this.message = 'Hello World!';
            client.configure(function (config) {
                config
                    .useStandardConfiguration();
            });
        }
        App.prototype.activate = function () {
            var _this = this;
            return this.client.fetch('https://api.github.com/users')
                .then(function (response) { return response.json(); })
                .then(function (users) {
                var res = users;
                var usersToAdd = [];
                while (usersToAdd.length < 1000) {
                    for (var index = 0; index < res.length; index++) {
                        var element = res[index];
                        usersToAdd.push(element);
                    }
                }
                return usersToAdd;
            }).then(function (usersToAdd) {
                _this.users = usersToAdd;
            }).then(function (x) {
                _this.properties = [];
                var object = _this.users[0];
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        _this.properties.push(property);
                    }
                }
            }).then(function (x) {
                _this.performanceTime = performance.now();
            });
        };
        App.prototype.attached = function () {
            var _this = this;
            this.taskQueue.queueTask(function () {
                _this.performanceTime = (performance.now() - _this.performanceTime) | 0;
            });
        };
        App = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, aurelia_framework_1.TaskQueue), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, aurelia_framework_1.TaskQueue])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Users (${users.length})</h1>\n  <h2>Render took ${performanceTime} ms</h2>\n  <table>\n    <thead>\n      <th repeat.for=\"property of properties\">\n        ${property}\n      </th>\n    </thead>\n    <tbody repeat.for=\"user of users\">\n      <tr>\n        <td repeat.for=\"property of properties\">\n          ${user[property]}\n      </tr>\n    </tbody>\n  </table>\n\n\n</template>"; });
//# sourceMappingURL=app-bundle.js.map