const extractor = require('../../../src/extractors/collections');
const { equal } = require('assert');

(function()
{
    equal(JSON.stringify(extractor()) === '[]', true,
        '@amjs-api-openapi-reader > extractor > collections > By default returns "[]"');
}());
