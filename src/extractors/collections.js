const { dotProp } = require('@amjs/utils');

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
