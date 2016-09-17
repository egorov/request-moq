# request-moq ![Build status](https://travis-ci.org/egorov/request-moq.svg?branch=master)

Mock object for use instead http [request](https://github.com/request/request) in unit tests.

You can add it to your project with npm:

    npm install --save-dev request-moq

Quickstart guide:

    var mRequest = require('request-moq');
    
    var options = {
        method: 'GET',
        url: 'http://localhost',
        headers: [ { Accept: 'application-json'} ]
        };
        
    mRequest.expect(options).respond({statusCode: 201});
    
    mRequest(options, function(error, response, body){
    
            expect(error).toBeUndefined();
            expect(response.statusCode).toEqual(201);
            expect(body).toBeUndefined();
            
        });
        
Other usage examples you can find at spec/RequestMoqSpec.js.