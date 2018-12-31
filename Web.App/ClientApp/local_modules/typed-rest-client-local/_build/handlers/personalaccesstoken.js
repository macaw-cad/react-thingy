"use strict";
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
var PersonalAccessTokenCredentialHandler = /** @class */ (function () {
    function PersonalAccessTokenCredentialHandler(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    PersonalAccessTokenCredentialHandler.prototype.prepareRequest = function (options) {
        options.headers['Authorization'] = 'Basic ' + new Buffer('PAT:' + this.token).toString('base64');
        options.headers['X-TFS-FedAuthRedirect'] = 'Suppress';
    };
    // This handler cannot handle 401
    PersonalAccessTokenCredentialHandler.prototype.canHandleAuthentication = function (response) {
        return false;
    };
    PersonalAccessTokenCredentialHandler.prototype.handleAuthentication = function (httpClient, requestInfo, objs) {
        return null;
    };
    return PersonalAccessTokenCredentialHandler;
}());
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
