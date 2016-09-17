describe('request-moq', function(){
    "use strict";

    var requestMoq = require('../index');
    var method, url, body, headers;

    beforeEach(function(){

        method = 'GET';
        url = 'http://localhost:8888';
        body = {
            name: 'value'
        };
        headers = [ { Authorization: 'Bearer 8Dn2Lsh-8U=0'} ];
    });

    beforeEach(function(){
        expect(requestMoq.expectations.getCount()).toEqual(0);
    });

    afterEach(function(){
        requestMoq.clearExpectations();
    });

    it('should throw on expect without options', function(){

        var assert = function(){
            requestMoq.expect();
        };

        expect(assert).toThrow(new Error('undefined is not a valid url or options object.'));

    });

    it('should throw on expect without url', function(){

        var assert = function(){
            requestMoq.expect({ method: method });
        };

        expect(assert).toThrow(new Error('undefined is not a valid url or options object.'));

    });

    it('should by default set method to GET', function(){

        requestMoq.expect({ url: url });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual('GET');
        expect(expected.request.url).toEqual(url);
        expect(expected.response).toBeUndefined();

    });

    it('should not set unknown data option', function(){

        requestMoq.expect({ method: method, url: url, data: body });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual(method);
        expect(expected.request.url).toEqual(url);
        expect(expected.request.data).toBeUndefined();
        expect(expected.response).toBeUndefined();
    });

    it('should set request method, url and body', function(){

        requestMoq.expect({ method: method, url: url, body: body });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual(method);
        expect(expected.request.url).toEqual(url);
        expect(expected.request.body).toEqual(body);
        expect(expected.response).toBeUndefined();
    });

    it('should set request method, url, body and headers', function(){

        requestMoq.expect({ method: method, url: url, body: body, headers: headers });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual(method);
        expect(expected.request.url).toEqual(url);
        expect(expected.request.body).toEqual(body);
        expect(expected.request.headers).toEqual(headers);
        expect(expected.response).toBeUndefined();
    });

    it('should set response body', function(){

        requestMoq.expect({ method: method, url: url }).respond({ body: body });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual(method);
        expect(expected.request.url).toEqual(url);
        expect(expected.response.body).toEqual(body);
    });

    it('should set response statusCode and body', function(){

        requestMoq.expect({ method: method, url: url }).respond({ statusCode: 201, body: body });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual(method);
        expect(expected.request.url).toEqual(url);
        expect(expected.response.statusCode).toEqual(201);
        expect(expected.response.body).toEqual(body);

    });

    it('should set response statusCode, body and headers', function(){

        requestMoq.expect({ method: method, url: url }).respond({ statusCode: 201, body: body, headers: headers });
        var expected = requestMoq.expectations.dequeue();

        expect(expected.request.method).toEqual(method);
        expect(expected.request.url).toEqual(url);
        expect(expected.response.statusCode).toEqual(201);
        expect(expected.response.body).toEqual(body);
        expect(expected.response.headers).toEqual(headers);
    });

    it('should throw on request without url', function(){

        requestMoq.expect({ method: method, url: url });

        var assert = function(){
            requestMoq({ method: method });
        };

        expect(assert).toThrow(new Error('undefined is not a valid url or options object.'));

    });

    it('should send request with GET method by default', function(){

        requestMoq.expect({ url: url });
        requestMoq({ url: url });

    });

    it('should throw when methods not match', function(){

        requestMoq.expect({ method: 'OPTIONS', url: url });

        var assert = function(){
            requestMoq( { method: 'GET', url: url });
        };

        expect(assert).toThrow(new Error('Unexpected request method "GET" instead of "OPTIONS"!'));
    });

    it('should throw when urls not match', function(){

        requestMoq.expect({ method: method, url: url });

        var assert = function(){
            requestMoq( { method: method, url: 'http://localhost:3333' });
        };

        expect(assert).toThrow(new Error('Unexpected request url "http://localhost:3333" instead of "http://localhost:8888"!'));
    });

    it('should not throw if body is not expected', function(){

        requestMoq.expect({ method: method, url: url });

        requestMoq( { method: method,
            url: url,
            body: body
        });
    });

    it('should not throw if headers is not expected', function(){

        requestMoq.expect({ method: method, url: url });

        requestMoq( { method: method,
            url: url,
            headers: headers
        });
    });

    it('should not throw if body and headers is not expected', function(){

        requestMoq.expect({ method: method, url: url });

        requestMoq( { method: method,
            url: url,
            body: body,
            headers: headers
        });
    });

    it('should throw if body is not match', function(){

        requestMoq.expect({ method: method,
            url: url,
            body: body
        });

        var assert = function(){
            requestMoq( { method: method,
                url: url,
                body: { firstName: 'Jack' }
            });
        };

        expect(assert).toThrow(new Error('Unexpected request body {"firstName":"Jack"} instead of {"name":"value"}!'));
    });

    it('should throw if headers is not match', function(){

        requestMoq.expect({ method: method,
            url: url,
            body: body,
            headers: headers
        });

        var assert = function(){
            requestMoq( { method: method,
                url: url,
                body: body,
                headers: [{ 'Content-Type': 'text' }]
            });
        };

        expect(assert).toThrow(new Error('Unexpected request headers [{"Content-Type":"text"}] instead of [{"Authorization":"Bearer 8Dn2Lsh-8U=0"}]!'));
    });

    it('should not throw method and url match', function(){

        requestMoq.expect({ method: method, url: url });

        requestMoq({ method: method, url: url });

    });

    it('should not throw method, url and body match', function(){

        requestMoq.expect({ method: method, url: url, body: body });

        requestMoq({ method: 'GET', url: 'http://localhost:8888',
            body: {
                name: 'value'
            }
        });
    });

    it('should not throw when options match', function(){

        requestMoq.expect({ method: method,
            url: url,
            body: body,
            headers: headers
        });

        requestMoq({ method: method,
            url: url,
            body: body,
            headers: headers
        });
    });

    it('should respond with statusCode', function(){

        requestMoq.expect({ url: url, method: method })
            .respond({ statusCode: 200 });

        requestMoq({ url: url, method: method },
            function(error, response, body){
                expect(error).toBeUndefined();
                expect(response.statusCode).toEqual(200);
                expect(body).toBeUndefined();
            });
    });

    it('should respond with statusCode and body', function(){

        requestMoq.expect({ url: url, method: method })
            .respond({ statusCode: 200, body: body });

        requestMoq({ url: url, method: method },
            function(error, response, body){
                expect(error).toBeUndefined();
                expect(response.statusCode).toEqual(200);
                expect(response.body).toEqual(body);
                expect(body).toEqual(body);
            });
    });

    it('should respond with all options', function(){

        requestMoq.expect({ url: url, method: method })
            .respond({ statusCode: 200, body: body, headers: headers });

        requestMoq({ url: url, method: method },
            function(error, response, body){
                expect(error).toBeUndefined();
                expect(response.statusCode).toEqual(200);
                expect(response.body).toEqual(body);
                expect(response.headers).toEqual(headers);
                expect(body).toEqual(body);
            });

    });

    it('should check sequence of requests', function(){

        var postUrl = 'http://localhost:5555/api/somemethod';
        var postMethod = 'POST';
        var postStatusCode = 400;
        var postResponseBody = { error: 'Validation error!' };
        var postHeaders = { 'Cookie': '0923809rjlskdjflk' };

        requestMoq.expect({ url: url, method: method })
            .respond({ statusCode: 200, body: body, headers: headers });

        requestMoq.expect({ url: postUrl, method: postMethod })
            .respond({ statusCode: postStatusCode, body: postResponseBody, headers: postHeaders });

        requestMoq({ url: url, method: method },
            function(error, response, body){
                expect(error).toBeUndefined();
                expect(response.statusCode).toEqual(200);
                expect(response.body).toEqual(body);
                expect(response.headers).toEqual(headers);
                expect(body).toEqual(body);
            });

        requestMoq({ url: postUrl, method: postMethod },
            function(error, response, body){
                expect(error).toBeUndefined();
                expect(response.statusCode).toEqual(postStatusCode);
                expect(response.body).toEqual(postResponseBody);
                expect(response.headers).toEqual(postHeaders);
                expect(body).toEqual(postResponseBody);
            });

    });

});
