const { equal, throws } = require('assert');
const OpenApiReader     = require('../../src/Reader');
const path              = require('path');
const apiTestFile       = path.resolve(__dirname, 'api-test.yaml');

const before = source => new OpenApiReader(source);

(function()
{
    throws(() => before(), Error,
        '@amjs/api-openapi-reader > constructor > throws Error if source file is empty');
    throws(() => before('foo.yaml'), Error,
        '@amjs/api-openapi-reader > constructor > throws Error if source file not exists');
    throws(() => before(path.resolve(__dirname, 'reader.js')), Error,
        '@amjs/api-openapi-reader > constructor > throws Error if source file has not valid extension');
}());

(function()
{
    const sut = before(apiTestFile);
    equal(sut.source === apiTestFile, true,
        '@amjs/api-openapi-reader > source > Source file is stored into "source" property');
}());

(function()
{
    let sut = before(apiTestFile);
    sut = sut.read();
    equal(sut.yamlObject !== null, true,
        '@amjs/api-openapi-reader > read > yamlObject is not "null" after read()');
    equal(sut instanceof OpenApiReader, true,
        '@amjs/api-openapi-reader > read > returns self instance');
}());

(function()
{
    const sut = before(apiTestFile);
    const { collections, items, paths } = sut.read().parse();
    equal(collections !== null, true,
        '@amjs/api-openapi-reader > parse > collections > Is not "null" after parse()');
    equal(items !== null, true,
        '@amjs/api-openapi-reader > parse > items > Is not "null" after parse()');
    equal(paths !== null, true,
        '@amjs/api-openapi-reader > parse > paths > Is not "null" after parse()');

    console.log(JSON.stringify({ collections, items, paths }, null, 4));
}());
