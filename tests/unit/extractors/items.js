const extractor = require('../../../src/extractors/items');
const { equal } = require('assert');

(function()
{
    equal(JSON.stringify(extractor()) === '[]', true,
        '@amjs-api-openapi-reader > extractor > items > By default returns "[]"');
}());
