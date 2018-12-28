"use strict";
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var httpm = require("./HttpClient");
var util = require("./Util");
require('es6-promise').polyfill();
var RestClient = /** @class */ (function () {
    /**
     * Creates an instance of the RestClient
     * @constructor
     * @param {string} userAgent - userAgent for requests
     * @param {string} baseUrl - (Optional) If not specified, use full urls per request.  If supplied and a function passes a relative url, it will be appended to this
     * @param {ifm.IRequestHandler[]} handlers - handlers are typically auth handlers (basic, bearer, ntlm supplied)
     * @param {ifm.IRequestOptions} requestOptions - options for each http requests (http proxy setting, socket timeout)
     */
    function RestClient(userAgent, baseUrl, handlers, requestOptions) {
        this.client = new httpm.HttpClient(userAgent, handlers, requestOptions);
        if (baseUrl) {
            this._baseUrl = baseUrl;
        }
    }
    /**
     * Gets a resource from an endpoint
     * Be aware that not found returns a null.  Other error conditions reject the promise
     * @param {string} requestUrl - fully qualified or relative url
     * @param {IRequestOptions} requestOptions - (optional) requestOptions object
     */
    RestClient.prototype.options = function (requestUrl, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(requestUrl, this._baseUrl);
                        return [4 /*yield*/, this.client.options(url, this._headersFromOptions(options))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    /**
     * Gets a resource from an endpoint
     * Be aware that not found returns a null.  Other error conditions reject the promise
     * @param {string} resource - fully qualified url or relative path
     * @param {IRequestOptions} requestOptions - (optional) requestOptions object
     */
    RestClient.prototype.get = function (resource, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(resource, this._baseUrl);
                        return [4 /*yield*/, this.client.get(url, this._headersFromOptions(options))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    /**
     * Deletes a resource from an endpoint
     * Be aware that not found returns a null.  Other error conditions reject the promise
     * @param {string} resource - fully qualified or relative url
     * @param {IRequestOptions} requestOptions - (optional) requestOptions object
     */
    RestClient.prototype.del = function (resource, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(resource, this._baseUrl);
                        return [4 /*yield*/, this.client.del(url, this._headersFromOptions(options))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    /**
     * Creates resource(s) from an endpoint
     * T type of object returned.
     * Be aware that not found returns a null.  Other error conditions reject the promise
     * @param {string} resource - fully qualified or relative url
     * @param {IRequestOptions} requestOptions - (optional) requestOptions object
     */
    RestClient.prototype.create = function (resource, resources, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(resource, this._baseUrl);
                        headers = this._headersFromOptions(options, true);
                        data = JSON.stringify(resources, null, 2);
                        return [4 /*yield*/, this.client.post(url, data, headers)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    /**
     * Updates resource(s) from an endpoint
     * T type of object returned.
     * Be aware that not found returns a null.  Other error conditions reject the promise
     * @param {string} resource - fully qualified or relative url
     * @param {IRequestOptions} requestOptions - (optional) requestOptions object
     */
    RestClient.prototype.update = function (resource, resources, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(resource, this._baseUrl);
                        headers = this._headersFromOptions(options, true);
                        data = JSON.stringify(resources, null, 2);
                        return [4 /*yield*/, this.client.patch(url, data, headers)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    /**
     * Replaces resource(s) from an endpoint
     * T type of object returned.
     * Be aware that not found returns a null.  Other error conditions reject the promise
     * @param {string} resource - fully qualified or relative url
     * @param {IRequestOptions} requestOptions - (optional) requestOptions object
     */
    RestClient.prototype.replace = function (resource, resources, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(resource, this._baseUrl);
                        headers = this._headersFromOptions(options, true);
                        data = JSON.stringify(resources, null, 2);
                        return [4 /*yield*/, this.client.put(url, data, headers)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    RestClient.prototype.uploadStream = function (verb, requestUrl, stream, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util.getUrl(requestUrl, this._baseUrl);
                        headers = this._headersFromOptions(options, true);
                        return [4 /*yield*/, this.client.sendStream(verb, url, stream, headers)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this._processResponse(res, options)];
                }
            });
        });
    };
    RestClient.prototype._headersFromOptions = function (options, contentType) {
        options = options || {};
        var headers = options.additionalHeaders || {};
        headers["Accept"] = options.acceptHeader || "application/json";
        if (contentType) {
            headers["Content-Type"] = headers["Content-Type"] || 'application/json; charset=utf-8';
        }
        return headers;
    };
    RestClient.prototype._processResponse = function (res, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var statusCode, response, obj, contents, err_1, msg, err;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    statusCode = res.message.statusCode;
                                    response = {
                                        statusCode: statusCode,
                                        result: null,
                                    };
                                    // not found leads to null obj returned
                                    if (statusCode == httpm.HttpCodes.NotFound) {
                                        resolve(response);
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, res.readBody()];
                                case 2:
                                    contents = _a.sent();
                                    if (contents && contents.length > 0) {
                                        obj = JSON.parse(contents);
                                        if (options && options.responseProcessor) {
                                            response.result = options.responseProcessor(obj);
                                        }
                                        else {
                                            response.result = obj;
                                        }
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    return [3 /*break*/, 4];
                                case 4:
                                    // note that 3xx redirects are handled by the http layer.
                                    if (statusCode > 299) {
                                        msg = void 0;
                                        // if exception/error in body, attempt to get better error
                                        if (obj && obj.message) {
                                            msg = obj.message;
                                        }
                                        else {
                                            msg = "Failed request: (" + statusCode + ")";
                                        }
                                        err = new Error(msg);
                                        // attach statusCode and body obj (if available) to the error object
                                        err['statusCode'] = statusCode;
                                        if (response.result) {
                                            err['result'] = response.result;
                                        }
                                        reject(err);
                                    }
                                    else {
                                        resolve(response);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return RestClient;
}());
exports.RestClient = RestClient;
