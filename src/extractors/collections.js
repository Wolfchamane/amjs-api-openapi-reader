const { dotProp } = require('@amjs/utils');

/**
 * Extracts all the collections items schemas from api file.
 * @param   {Object}    api API Json object
 * @return  {Array}     Map of collections schemas
 */
module.exports = (api = {}) =>
{
    const collections = [];

    const schemas = api && api.components && api.components.schemas;
    if (schemas)
    {
        Object
            .keys(schemas)
            .filter(key => schemas[key].type === 'array')
            .forEach(
                id =>
                {
                    const item = schemas[id];
                    collections.push({
                        id,
                        itemType : dotProp(item, 'items.$ref')
                    });
                }
            );
    }

    return collections;
};
