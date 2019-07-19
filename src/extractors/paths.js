const { dotProp, capitalize, camelize } = require('@amjs/utils');

/* istanbul ignore next */
const pathExtractor = (collection = [], url = '', config = {}, parent) =>
{
    if (url.lastIndexOf('{') === -1 || parent)
    {
        const id = capitalize(camelize(url
            .replace(/\//g, '-')
            .replace(/[{}]+/g, '')
            .split('-')
            .filter(item => !!item)
            .join('-')));

        const allowedMethods = Object.keys(config);
        const models = {};
        const params = [];
        allowedMethods.forEach(
            method =>
            {
                const methodContext = config[method];
                models[method] = dotProp(methodContext, 'responses.200.content.application/json.schema.$ref');
                if (methodContext.parameters)
                {
                    methodContext.parameters.forEach(
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
                }
            }
        );

        const service = {
            allowedMethods,
            id,
            models,
            params,
            parent,
            url
        };

        collection.push(service);
    }

    if (url.lastIndexOf('{') !== -1 && !parent)
    {
        url = url.trim().split('/').filter(item => !!item);
        pathExtractor(collection, `/${url.join('/')}`, config, url[0]);
    }
};

module.exports = (api = {}) =>
{
    const _paths = [];
    const basePath = (api && api.basePath) || '';
    const paths = api && api.paths;

    if (paths)
    {
        Object.keys(paths).forEach(key => pathExtractor(_paths, key, paths[key]));
        _paths.forEach(service => service.url = `${basePath}${service.url}`);
    }

    return _paths;
};
