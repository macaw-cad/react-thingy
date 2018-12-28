// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var _ = require("underscore");
var ntlm = require("../opensource/node-http-ntlm/ntlm");
// require('es6-promise').polyfill();
var NtlmCredentialHandler = /** @class */ (function () {
    function NtlmCredentialHandler(username, password, workstation, domain) {
        this._ntlmOptions = {};
        this._ntlmOptions.username = username;
        this._ntlmOptions.password = password;
        if (domain !== undefined) {
            this._ntlmOptions.domain = domain;
        }
        if (workstation !== undefined) {
            this._ntlmOptions.workstation = workstation;
        }
    }
    NtlmCredentialHandler.prototype.prepareRequest = function (options) {
        // No headers or options need to be set.  We keep the credentials on the handler itself.
        // If a (proxy) agent is set, remove it as we don't support proxy for NTLM at this time
        if (options.agent) {
            delete options.agent;
        }
    };
    NtlmCredentialHandler.prototype.canHandleAuthentication = function (response) {
        if (response && response.message && response.message.statusCode === 401) {
            // Ensure that we're talking NTLM here
            // Once we have the www-authenticate header, split it so we can ensure we can talk NTLM
            var wwwAuthenticate = response.message.headers['www-authenticate'];
            if (wwwAuthenticate) {
                var mechanisms = wwwAuthenticate.split(', ');
                var index = mechanisms.indexOf("NTLM");
                if (index >= 0) {
                    return true;
                }
            }
        }
        return false;
    };
    NtlmCredentialHandler.prototype.handleAuthentication = function (httpClient, requestInfo, objs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                // We have to readbody on the response before continuing otherwise there is a hang.
                res.readBody().then(function () {
                    resolve(res);
                });
            };
            _this.handleAuthenticationPrivate(httpClient, requestInfo, objs, callbackForResult);
        });
    };
    NtlmCredentialHandler.prototype.handleAuthenticationPrivate = function (httpClient, requestInfo, objs, finalCallback) {
        // Set up the headers for NTLM authentication
        requestInfo.options = _.extend(requestInfo.options, {
            username: this._ntlmOptions.username,
            password: this._ntlmOptions.password,
            domain: this._ntlmOptions.domain,
            workstation: this._ntlmOptions.workstation
        });
        if (httpClient.isSsl === true) {
            requestInfo.options.agent = new https.Agent({ keepAlive: true });
        }
        else {
            requestInfo.options.agent = new http.Agent({ keepAlive: true });
        }
        var self = this;
        // The following pattern of sending the type1 message following immediately (in a setImmediate) is
        // critical for the NTLM exchange to happen.  If we removed setImmediate (or call in a different manner)
        // the NTLM exchange will always fail with a 401.
        this.sendType1Message(httpClient, requestInfo, objs, function (err, res) {
            if (err) {
                return finalCallback(err, null, null);
            }
            /// We have to readbody on the response before continuing otherwise there is a hang.
            res.readBody().then(function () {
                // It is critical that we have setImmediate here due to how connection requests are queued.
                // If setImmediate is removed then the NTLM handshake will not work.
                // setImmediate allows us to queue a second request on the same connection. If this second 
                // request is not queued on the connection when the first request finishes then node closes
                // the connection. NTLM requires both requests to be on the same connection so we need this.
                setImmediate(function () {
                    self.sendType3Message(httpClient, requestInfo, objs, res, finalCallback);
                });
            });
        });
    };
    // The following method is an adaptation of code found at https://github.com/SamDecrock/node-http-ntlm/blob/master/httpntlm.js
    NtlmCredentialHandler.prototype.sendType1Message = function (httpClient, requestInfo, objs, finalCallback) {
        var type1msg = ntlm.createType1Message(this._ntlmOptions);
        var type1options = {
            headers: {
                'Connection': 'keep-alive',
                'Authorization': type1msg
            },
            timeout: requestInfo.options.timeout || 0,
            agent: requestInfo.httpModule,
        };
        var type1info = {};
        type1info.httpModule = requestInfo.httpModule;
        type1info.parsedUrl = requestInfo.parsedUrl;
        type1info.options = _.extend(type1options, _.omit(requestInfo.options, 'headers'));
        return httpClient.requestRawWithCallback(type1info, objs, finalCallback);
    };
    // The following method is an adaptation of code found at https://github.com/SamDecrock/node-http-ntlm/blob/master/httpntlm.js
    NtlmCredentialHandler.prototype.sendType3Message = function (httpClient, requestInfo, objs, res, callback) {
        if (!res.message.headers && !res.message.headers['www-authenticate']) {
            throw new Error('www-authenticate not found on response of second request');
        }
        var type2msg = ntlm.parseType2Message(res.message.headers['www-authenticate']);
        var type3msg = ntlm.createType3Message(type2msg, this._ntlmOptions);
        var type3options = {
            headers: {
                'Authorization': type3msg,
                'Connection': 'Close'
            },
            agent: requestInfo.httpModule,
        };
        var type3info = {};
        type3info.httpModule = requestInfo.httpModule;
        type3info.parsedUrl = requestInfo.parsedUrl;
        type3options.headers = _.extend(type3options.headers, requestInfo.options.headers);
        type3info.options = _.extend(type3options, _.omit(requestInfo.options, 'headers'));
        return httpClient.requestRawWithCallback(type3info, objs, callback);
    };
    return NtlmCredentialHandler;
}());
export { NtlmCredentialHandler };
