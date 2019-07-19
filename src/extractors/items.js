const { capitalize, dotProp } = require('@amjs/utils');

/* istanbul ignore next */
/**
 * Updates relationships between items in collection, flagging which one is parent
 * @param   {Array} collection  Map of parsed items
 * @param   {Array} relations   Relations between objects
 */
const updateItemsRelations = (collection = [], relations = []) =>
{
    relations.filter(rel => !!rel).forEach(
        relation =>
        {
            collection.forEach(
                item =>
                {
                    const pattern = `#/components/schemas/${item.id}`;
                    if (pattern === relation.to)
                    {
                        item.parent = relation.from.toLowerCase();
                    }
                }
            );
        }
    );

};

/* istanbul ignore next */
/**
 * Extracts all the information from a single item and adds mapped info into collection
 * @param   {Array}     collection  Collection of parsed items
 * @param   {String}    id          Unique identifier of the item
 * @param   {Object}    item        Item to be parsed
 * @return  {*}         Parent configuration of parsed item, to be updated later
 */
const itemExtractor = (collection = [], id = '', item = {}) =>
{
    let parent = null;

    const properties = Object
        .keys(item.properties)
        .map(
            name =>
            {
                const property = item.properties[name];
                let type = property.type;

                if (type === 'array' && property.items)
                {
                    type = dotProp(property, 'items.$ref');

                    parent = {
                        from : id,
                        to: type
                    };
                }

                type = capitalize(type);

                return {
                    name, type
                };
            }
        );

    collection.push({
        id, properties
    });

    return parent;
};

/**
 * Extracts all the item schemas info from api file.
 * @param   {Object}    api API Json object
 * @return  {Array}     Map of items
 */
module.exports = (api = {}) =>
{
    const items = [];
    const relations = [];

    const schemas = api && api.components && api.components.schemas;
    if (schemas)
    {
        Object
            .keys(schemas)
            .filter(key => (!schemas[key].type || schemas[key].type !== 'array'))
            .forEach(id => relations.push(itemExtractor(items, id, schemas[id])));

        updateItemsRelations(items, relations);
    }

    return items;
};
