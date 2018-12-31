"use strict";
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
var BasicCredentialHandler = /** @class */ (function () {
    function BasicCredentialHandler(username, password) {
        this.username = username;
        this.password = password;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    BasicCredentialHandler.prototype.prepareRequest = function (options) {
        options.headers['Authorization'] = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');
        options.headers['X-TFS-FedAuthRedirect'] = 'Suppress';
    };
    // This handler cannot handle 401
    BasicCredentialHandler.prototype.canHandleAuthentication = function (response) {
        return false;
    };
    BasicCredentialHandler.prototype.handleAuthentication = function (httpClient, requestInfo, objs) {
        return null;
    };
    return BasicCredentialHandler;
}());
exports.BasicCredentialHandler = BasicCredentialHandler;
