/*jslint indent: 2, eqeqeq: false, onevar: false, forin: true*/
/*global module, require*/
var sinon = (function () {
  return {
    wrapMethod: function wrapMethod(object, property, method) {
      if (!object) {
        throw new TypeError("Should wrap property of object");
      }

      if (typeof method != "function") {
        throw new TypeError("Method wrapper should be function");
      }

      var wrappedMethod = object[property];
      var type = typeof wrappedMethod;

      if (!!wrappedMethod && type != "function") {
        throw new TypeError("Attempted to wrap " + type + " as function");
      }

      object[property] = method;

      method.restore = function () {
        object[property] = wrappedMethod;
      };

      return method;
    },

    extend: function extend(target) {
      for (var i = 1, l = arguments.length; i < l; i += 1) {
        for (var prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop];
          }
        }
      }

      return target;
    },

    create: function create(proto) {
      if (Object.create) {
        return Object.create(proto);
      } else {
        var F = function () {};
        F.prototype = proto;
        return new F();
      }
    },

    deepEqual: function deepEqual(a, b) {
      if (typeof a != "object" || typeof b != "object") {
        return a === b;
      }

      if (a === b) {
        return true;
      }

      if (Object.prototype.toString.call(a) == "[object Array]") {
        if (a.length !== b.length) {
          return false;
        }

        for (var i = 0, l = a.length; i < l; i += 1) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }

        return true;
      }

      var prop, aLength = 0, bLength = 0;

      for (prop in a) {
        aLength += 1;

        if (!deepEqual(a[prop], b[prop])) {
          return false;
        }
      }

      for (prop in b) {
        bLength += 1;
      }

      if (aLength != bLength) {
        return false;
      }

      return true;
    },

    keys: function keys(object) {
      var objectKeys = [];

      for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
          objectKeys.push(prop);
        }
      }

      return objectKeys.sort();
    }
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
  module.exports.spy = require("sinon/spy");
  module.exports.stub = require("sinon/stub");
  module.exports.mock = require("sinon/mock");
  module.exports.assert = require("sinon/assert");
  module.exports.test = require("sinon/test");
  module.exports.testCase = require("sinon/test_case");
}
