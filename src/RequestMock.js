var assert = require('assert');

var expectResponse = {
    statusCode: undefined,
    body: undefined,
    headers: undefined
};

var expectRequest = {
    method: undefined,
    url: undefined,
    body: undefined,
    headers: undefined
};

var requestMock = function(options, callback){
    "use strict";

    validateOptions(options);

    var expected = requestMock.expectations.dequeue();
    var expReq = copy(expected.request);
    var expResp = copy(expected.response);

    assertValue('method', expReq, options);
    assertValue('url', expReq, options);
    assertValue('body', expReq, options);
    assertValue('headers', expReq, options);

    if(callback)
        callback(undefined, expResp, expResp.body);

};

requestMock.expectations = require('fixed-size-queue').create();

function validateOptions(options){
    if(typeof options === 'undefined')
        throw new Error('undefined is not a valid url or options object.');

    if(typeof options.url === 'undefined')
        throw new Error('undefined is not a valid url or options object.');

    if(!options.method)
        options.method = 'GET';
}

requestMock.respond = function(options){
    "use strict";

    var expectedResponse = {};
    for(var property in options){
        if(expectResponse.hasOwnProperty(property))
            expectedResponse[property] = options[property];
    }

    var expectedRequest = requestMock.expectations.last();
    expectedRequest.response = expectedResponse;

};

var assertValue = function(name, expect, actual){
    "use strict";

    if(!expect[name])
        return;

    assert.deepEqual(expect[name],
        actual[name],
        'Unexpected request ' + name + ' ' + JSON.stringify(actual[name]) + ' instead of ' + JSON.stringify(expect[name]) + '!');

};

var copy = function(obj){
    "use strict";

    var result = {};

    Object.assign(result, obj);

    return result;

};

requestMock.clearExpectations = function(){
    'use strict';

    while(this.expectations.getCount() > 0){
        this.expectations.dequeue();
    }

};

requestMock.expect = function(options){
    "use strict";

    validateOptions(options);

    var expectedRequest = {};
    for(var property in options){
        if(expectRequest.hasOwnProperty(property))
            expectedRequest[property] = options[property];
    }

    requestMock.expectations.enqueue( { request: expectedRequest });

    return this;

};

module.exports = requestMock;
