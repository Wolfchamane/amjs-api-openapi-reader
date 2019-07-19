const extractor = require('../../../src/extractors/paths');
const { equal } = require('assert');

(function()
{
    equal(JSON.stringify(extractor()) === '[]', true,
        '@amjs-api-openapi-reader > extractor > paths > By default returns "[]"');
}());
