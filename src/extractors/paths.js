const { dotProp, capitalize, camelize } = require('@amjs/utils');

/* istanbul ignore next */
/**
 * Extracts the unique params required by the path endpoint
 * @param   {Object}    context Path method configuration
 * @param   {Array}     params  Collection of mapped endpoint params
 */
const extractMethodParams = (context = {}, params = []) =>
{
    context.parameters.forEach(
        param =>
        {
            const name = dotProp(param, 'name');
            if (!params.find(item => item.name === name))
            {
                params.push({
                    name,
                    type        : capitalize(dotProp(param, 'schema.type')),
                    required    : !!param.required
                });
            }
        }
    )
};

/* istanbul ignore next */
/**
 * Extracts all info from a path method
 * @param   {String}    method  Path method
 * @param   {Object}    item    Path configuration
 * @param   {Object}    models  Associated return models from path method, for ORM purposes
 * @param   {Array}     params  Params associated with path endpoint
 */
const extractMethodInfo = (method = '', item = {}, models = {}, params = []) =>
{
    const context = item[method];
    models[method] = dotProp(context, 'responses.200.content.application/json.schema.$ref');
    if (context.parameters)
    {
        extractMethodParams(context, params);
    }
};

/* istanbul ignore next */
/**
 * Extracts all the info from a single api path
 * @param   {Array}     collection  Map of parsed API paths
 * @param   {*}         url         Path endpoint
 * @param   {Object}    item        Path configuration
 * @param   {*}         parent      Parent path related with path endpoint
 */
const pathExtractor = (collection = [], url = '', item = {}, parent) =>
{
    if (url.lastIndexOf('{') === -1 || parent)
    {
        const id = capitalize(camelize(url
            .replace(/\//g, '-')
            .replace(/[{}]+/g, '')
            .split('-')
            .filter(item => !!item)
            .join('-')));

        const allowedMethods = Object.keys(item);
        const models = {};
        const params = [];

        allowedMethods.forEach(method => extractMethodInfo(method, item, models, params));

        collection.push({
            allowedMethods,
            id,
            models,
            params,
            parent,
            url
        });
    }

    if (url.lastIndexOf('{') !== -1 && !parent)
    {
        url = url.trim().split('/').filter(item => !!item);
        pathExtractor(collection, `/${url.join('/')}`, item, url[0]);
    }
};

/**
 * Extracts all paths info from API file
 */
module.exports = (paths = {}) =>
{
    const _paths = [];
    Object.keys(paths).forEach(key => pathExtractor(_paths, key, paths[key]));

    return _paths;
};
