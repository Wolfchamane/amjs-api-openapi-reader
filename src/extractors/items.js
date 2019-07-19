const { capitalize, dotProp } = require('@amjs/utils');

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
