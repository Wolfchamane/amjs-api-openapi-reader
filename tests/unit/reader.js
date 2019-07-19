const { equal }     = require('assert');
const OpenApiReader = require('../../src/reader');
const path          = require('path');
const apiTestFile   = path.resolve(__dirname, '..', 'e2e', 'api-test.yaml');

(function()
{
    const sut = new OpenApiReader(apiTestFile);
    equal(JSON.stringify(sut._removeSelfReferences()) === JSON.stringify({}), true,
        '@amjs-api-openapi-reader > reader > _removeSelfReference by default returns "{}"');
}());
