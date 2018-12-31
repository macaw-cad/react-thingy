// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var BearerCredentialHandler = /** @class */ (function () {
    function BearerCredentialHandler(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    BearerCredentialHandler.prototype.prepareRequest = function (options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
        options.headers['X-TFS-FedAuthRedirect'] = 'Suppress';
    };
    // This handler cannot handle 401
    BearerCredentialHandler.prototype.canHandleAuthentication = function (response) {
        return false;
    };
    BearerCredentialHandler.prototype.handleAuthentication = function (httpClient, requestInfo, objs) {
        return null;
    };
    return BearerCredentialHandler;
}());
export { BearerCredentialHandler };
