// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var url = require("url");
var http = require("http");
var https = require("https");
var ifm = require('./Interfaces');

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
export var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes || (HttpCodes = {}));
var HttpRedirectCodes = [HttpCodes.MovedPermanently, HttpCodes.ResourceMoved, HttpCodes.SeeOther, HttpCodes.TemporaryRedirect, HttpCodes.PermanentRedirect];
var HttpClientResponse = /** @class */ (function () {
    function HttpClientResponse(message) {
        this.message = message;
    }
    HttpClientResponse.prototype.readBody = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var output;
            return __generator(this, function (_a) {
                output = '';
                this.message.on('data', function (chunk) {
                    output += chunk;
                });
                this.message.on('end', function () {
                    resolve(output);
                });
                return [2 /*return*/];
            });
        }); });
    };
    return HttpClientResponse;
}());
export { HttpClientResponse };
export function isHttps(requestUrl) {
    var parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
var EnvironmentVariables;
(function (EnvironmentVariables) {
    EnvironmentVariables["HTTP_PROXY"] = "HTTP_PROXY";
    EnvironmentVariables["HTTPS_PROXY"] = "HTTPS_PROXY";
})(EnvironmentVariables || (EnvironmentVariables = {}));
var HttpClient = /** @class */ (function () {
    function HttpClient(userAgent, handlers, requestOptions) {
        var _this = this;
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._maxRedirects = 50;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            this._httpProxy = requestOptions.proxy;
            if (requestOptions.proxy && requestOptions.proxy.proxyBypassHosts) {
                this._httpProxyBypassHosts = [];
                requestOptions.proxy.proxyBypassHosts.forEach(function (bypass) {
                    _this._httpProxyBypassHosts.push(new RegExp(bypass, 'i'));
                });
            }
            this._certConfig = requestOptions.cert;
            // cache the cert content into memory, so we don't have to read it from disk every time 
            if (this._certConfig && this._certConfig.caFile && fs.existsSync(this._certConfig.caFile)) {
                this._ca = fs.readFileSync(this._certConfig.caFile, 'utf8');
            }
            if (this._certConfig && this._certConfig.certFile && fs.existsSync(this._certConfig.certFile)) {
                this._cert = fs.readFileSync(this._certConfig.certFile, 'utf8');
            }
            if (this._certConfig && this._certConfig.keyFile && fs.existsSync(this._certConfig.keyFile)) {
                this._key = fs.readFileSync(this._certConfig.keyFile, 'utf8');
            }
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
        }
    }
    HttpClient.prototype.options = function (requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    };
    HttpClient.prototype.get = function (requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    };
    HttpClient.prototype.del = function (requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    };
    HttpClient.prototype.post = function (requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    };
    HttpClient.prototype.patch = function (requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    };
    HttpClient.prototype.put = function (requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    };
    HttpClient.prototype.head = function (requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    };
    HttpClient.prototype.sendStream = function (verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    };
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    HttpClient.prototype.request = function (verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var info, response, authenticationHandler, i, redirectsRemaining, redirectUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._disposed) {
                            throw new Error("Client has already been disposed.");
                        }
                        info = this._prepareRequest(verb, requestUrl, headers);
                        return [4 /*yield*/, this.requestRaw(info, data)];
                    case 1:
                        response = _a.sent();
                        // Check if it's an authentication challenge
                        if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
                            authenticationHandler = void 0;
                            for (i = 0; i < this.handlers.length; i++) {
                                if (this.handlers[i].canHandleAuthentication(response)) {
                                    authenticationHandler = this.handlers[i];
                                    break;
                                }
                            }
                            if (authenticationHandler) {
                                return [2 /*return*/, authenticationHandler.handleAuthentication(this, info, data)];
                            }
                            else {
                                // We have received an unauthorized response but have no handlers to handle it.
                                // Let the response return to the caller.
                                return [2 /*return*/, response];
                            }
                        }
                        redirectsRemaining = this._maxRedirects;
                        _a.label = 2;
                    case 2:
                        if (!(HttpRedirectCodes.indexOf(response.message.statusCode) != -1
                            && this._allowRedirects
                            && redirectsRemaining > 0)) return [3 /*break*/, 5];
                        redirectUrl = response.message.headers["location"];
                        if (!redirectUrl) {
                            // if there's no location to redirect to, we won't
                            return [3 /*break*/, 5];
                        }
                        // we need to finish reading the response before reassigning response
                        // which will leak the open socket.
                        return [4 /*yield*/, response.readBody()];
                    case 3:
                        // we need to finish reading the response before reassigning response
                        // which will leak the open socket.
                        _a.sent();
                        // let's make the request with the new redirectUrl
                        info = this._prepareRequest(verb, redirectUrl, headers);
                        return [4 /*yield*/, this.requestRaw(info, data)];
                    case 4:
                        response = _a.sent();
                        redirectsRemaining--;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    HttpClient.prototype.dispose = function () {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    };
    /**
     * Raw request.
     * @param info
     * @param data
     */
    HttpClient.prototype.requestRaw = function (info, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            _this.requestRawWithCallback(info, data, callbackForResult);
        });
    };
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    HttpClient.prototype.requestRawWithCallback = function (info, data, onResult) {
        var socket;
        var isDataString = typeof (data) === 'string';
        if (typeof (data) === 'string') {
            info.options.headers["Content-Length"] = Buffer.byteLength(data, 'utf8');
        }
        var callbackCalled = false;
        var handleResult = function (err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        var req = info.httpModule.request(info.options, function (msg) {
            var res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', function (sock) {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, function () {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof (data) === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof (data) !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    };
    HttpClient.prototype._prepareRequest = function (method, requestUrl, headers) {
        var info = {};
        info.parsedUrl = url.parse(requestUrl);
        var usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        var defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = headers || {};
        info.options.headers["User-Agent"] = this.userAgent;
        info.options.agent = this._getAgent(requestUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(function (handler) {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    };
    HttpClient.prototype._getAgent = function (requestUrl) {
        var agent;
        var proxy = this._getProxy(requestUrl);
        var useProxy = proxy.proxyUrl && proxy.proxyUrl.hostname && !this._isBypassProxy(requestUrl);
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        var parsedUrl = url.parse(requestUrl);
        var usingSsl = parsedUrl.protocol === 'https:';
        var maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            var agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxy.proxyAuth,
                    host: proxy.proxyUrl.hostname,
                    port: proxy.proxyUrl.port
                },
            };
            var tunnelAgent = void 0;
            var overHttps = proxy.proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            var options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = objectAssign(agent.options || {}, { rejectUnauthorized: false });
        }
        if (usingSsl && this._certConfig) {
            agent.options = objectAssign(agent.options || {}, { ca: this._ca, cert: this._cert, key: this._key, passphrase: this._certConfig.passphrase });
        }
        return agent;
    };
    HttpClient.prototype._getProxy = function (requestUrl) {
        var parsedUrl = url.parse(requestUrl);
        var usingSsl = parsedUrl.protocol === 'https:';
        var proxyConfig = this._httpProxy;
        // fallback to http_proxy and https_proxy env
        var https_proxy = process.env[EnvironmentVariables.HTTPS_PROXY];
        var http_proxy = process.env[EnvironmentVariables.HTTP_PROXY];
        if (!proxyConfig) {
            if (https_proxy && usingSsl) {
                proxyConfig = {
                    proxyUrl: https_proxy
                };
            }
            else if (http_proxy) {
                proxyConfig = {
                    proxyUrl: http_proxy
                };
            }
        }
        var proxyUrl;
        var proxyAuth;
        if (proxyConfig) {
            if (proxyConfig.proxyUrl.length > 0) {
                proxyUrl = url.parse(proxyConfig.proxyUrl);
            }
            if (proxyConfig.proxyUsername || proxyConfig.proxyPassword) {
                proxyAuth = proxyConfig.proxyUsername + ":" + proxyConfig.proxyPassword;
            }
        }
        return { proxyUrl: proxyUrl, proxyAuth: proxyAuth };
    };
    HttpClient.prototype._isBypassProxy = function (requestUrl) {
        if (!this._httpProxyBypassHosts) {
            return false;
        }
        var bypass = false;
        this._httpProxyBypassHosts.forEach(function (bypassHost) {
            if (bypassHost.test(requestUrl)) {
                bypass = true;
            }
        });
        return bypass;
    };
    return HttpClient;
}());
export { HttpClient };
