const fs    = require('fs');
const yaml  = require('yaml');

/**
 * Base class which handles OpenAPI spec file reading and parsing.
 * @namespace   amjs.api.openApi
 * @class       amjs.api.openApi.Reader
 */
class AmjsApiOpenApiReader
{
    /**
     * @constructor
     * @param   {String}    source  Path to OpenAPI spec file
     */
    constructor(source = '')
    {
        this.source         = '';
        this.yamlObject     = null;
        this.collections    = null;
        this.items          = null;
        this.services       = null;

        if (fs.existsSync(source) && (fs.statSync(source)).isFile() && /.+ya?ml$/.test(source))
        {
            this.source = source;
        }
        else
        {
            throw new Error(`@amjs/api-openapi-reader: Source file "${source}" is not a valid .ya?ml file`);
        }
    }

    /**
     * Reads and stores OpenAPI source file into yamlObject property
     * @return {*}  Self instance
     */
    read()
    {
        this.yamlObject = yaml.parse(fs.readFileSync(this.source, 'utf-8').toString());

        return this;
    }

    parse()
    {
        const collections   = this.collections  = require('./extractors/collections')(this.yamlObject);
        const items         = this.items        = require('./extractors/items')(this.yamlObject);
        const paths         = this.paths        = require('./extractors/paths')(this.yamlObject);

        this._removeSelfReferences({ collections, items, paths });

        return { collections, items, paths };
    }

    _removeSelfReferences(ref = {})
    {
        const pattern = /^#\/components\/schemas\//;
        Object
            .keys(ref)
            .forEach(
                key =>
                {
                    if (typeof ref[key] === 'object')
                    {
                        ref[key] = this._removeSelfReferences(ref[key]);
                    }
                    else
                    {
                        const value = ref[key];
                        if (value && pattern.test(value))
                        {
                            ref[key] = value.replace(pattern, '');
                        }
                    }
                },
                this
            );

        return ref;
    }
}

module.exports = AmjsApiOpenApiReader;
