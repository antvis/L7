
module.exports = function configureCamleCaseProps (delim) {
    var camelCase = require('../../util/camel-case')(delim);

    var fn = function camelCaseProps (value) {
        var path = this.path;
        var isProps = path[path.length - 1] === 'props';

        if (isProps) {
            this.update(
                Object.
                keys(value).
                reduce(function (acc, cur) {
                    var key = cur.startsWith("aria-")
                        || cur.startsWith("data-") ? cur : camelCase(cur);
                    acc[key] = value[cur];
                    return acc;
                }, {})
            );
        }
    };

    if (arguments.length === 2) {
        return fn(arguments[1]);
    }
    
    return fn;
};
