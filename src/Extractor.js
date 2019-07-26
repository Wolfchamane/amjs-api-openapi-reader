const { dotProp } = require('@amjs/utils');
const pathExtractor = require('./extractors/paths');
const itemExtractor = require('./extractors/items');
const collectionExtractor = require('./extractors/collections');

class AmjsApiOpenApiReaderExtractor
{
    constructor(api = {})
    {
        this.api = api;

        this.collections = [];
        this.items = [];
        this.paths = [];
    }

    _removeSelfReference(ref = {})
    {
        if (ref && typeof ref === 'object')
        {
            Object.keys(ref)
                .forEach(
                    key =>
                    {
                        if (Array.isArray(ref[key]))
                        {
                            ref[key].forEach(item => this._removeSelfReference(item));
                        }
                        else if (typeof ref[key] === 'object')
                        {
                            this._removeSelfReference(ref[key]);
                        }
                        else if (typeof ref[key] === 'string')
                        {
                            ref[key] = ref[key].replace('#/components/schemas/', '');
                        }
                    },
                    this
                );
        }
    }

    parse()
    {
        const models = dotProp(this.api, 'components.schemas') || {};
        const paths = dotProp(this.api, 'paths') || {};

        Object.keys(models)
            .filter(key => dotProp(models, `${key}.type`) === 'array')
            .forEach(key => this.collections.push(collectionExtractor(key, models[key])));

        Object.keys(models)
            .filter(key => !dotProp(models, `${key}.type`))
            .forEach(key => this.items.push(itemExtractor(key, models[key])));

        this.paths = pathExtractor(paths);

        const result = {
            collections : this.collections,
            items       : this.items,
            paths       : this.paths
        };
        this._removeSelfReference(result);

        return result;
    }
}

module.exports = AmjsApiOpenApiReaderExtractor;
