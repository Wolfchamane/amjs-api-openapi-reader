const { capitalize, dotProp } = require('@amjs/utils');

/**
 * Extracts all the item schemas info from api file.
 */
module.exports = (id = '', item = {}) =>
{
    const requirements = [];
    let properties = dotProp(item, 'properties');
    properties = Object.keys(properties || {})
        .map(
            name =>
            {
                let isCollection = false;
                const property = properties[name];
                let type = capitalize(dotProp(property, 'type'));

                if (type !== '*')
                {
                    isCollection = type === 'array' && !!property.items;
                    if (isCollection)
                    {
                        type = dotProp(property, 'items.$ref');
                    }

                    if (!requirements.includes(type))
                    {

                        requirements.push(type);
                    }
                }

                return { name, type, isCollection };
            }
        );

    return { id, properties, requirements };
};
