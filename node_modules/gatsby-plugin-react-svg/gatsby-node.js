exports.onCreateWebpackConfig = ({
	stage, actions, getConfig, rules
}, { rule: ruleProps = {} }) => {
	const { include, exclude, filters = [], omitKeys, ...otherProps } = ruleProps

	if([
		'develop',
		'develop-html',
		'build-html',
		'build-javascript'
	].includes(stage)) {
        if (omitKeys && Array.isArray(omitKeys) && omitKeys.length) {
            const removals = new RegExp(omitKeys.join('|'), 'i')

            filters.push(function(value) {
                Object.keys(value).forEach(function(key) {
                    if (removals.test(key)) {
                        delete value[key];
                    }
                 });
            })
        }

		// Add the svg-react-loader rule
		actions.setWebpackConfig({
			module: {
				rules: [
					{
                        test: /\.svg$/,
                        include,
                        exclude,
                        ...otherProps,
						use: {
                            loader: 'svg-react-loader',
                            options: {
                                filters
                            }
                        },
					}
				],
			}
		})
		const cfg = getConfig()
		const imgsRule = rules.images()

		const newUrlLoaderRule = (include || exclude) ? {
			...imgsRule,
			include: exclude,
			exclude: include
		} : {
			...imgsRule,
			test: new RegExp(imgsRule.test.toString().replace('svg|', '').slice(1, -1))
		}

		cfg.module.rules = [
			// Remove the base url-loader images rule entirely
			...cfg.module.rules.filter(rule => {
				if(rule.test) {
					return rule.test.toString() !== imgsRule.test.toString()
				}
				return true
			}),
			// Put it back without SVG loading
			newUrlLoaderRule
		]
		actions.replaceWebpackConfig(cfg)
	}
}

