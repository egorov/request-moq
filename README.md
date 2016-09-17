# request-mock

Mock object for use instead http request in unit tests.

You can add it to your project with npm:

    npm install --save-dev request-mock

Quickstart guide:

    var mRequest = require('request-mock');
    
    var options = {
        method: 'GET',
        url: 'http://localhost',
        headers: 'Accept: applicaton-json'
        };
        
    mRequest.expect(options).respond({statusCode: 201});
    
    mRequest(options, function(error, response, body){
    
            expect(error).toBeUndefined();
            expect(response.statusCode).toEqual(201);
            expect(body).toBeUndefined();
            
        });
        
Other usage examples you can find at spec/RequestMockSpec.js.