const { dotProp } = require('@amjs/utils');

/**
 * Extracts all the collections items schemas from api file.
 */
module.exports = (id = '', item) =>
{
    return {
        id,
        itemType : dotProp(item, 'items.$ref')
    };
};
