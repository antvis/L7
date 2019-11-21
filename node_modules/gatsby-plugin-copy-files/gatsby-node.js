const path = require('path');
const fsExtra = require('fs-extra');

exports.onCreateNode = ({ node }, pluginOptions) => {
	const { source, destination } = pluginOptions;
	const sourceNormalized = path.normalize(source);
	if (node.internal.type === 'File') {
		const dir = path.normalize(node.dir);
		if (dir.includes(sourceNormalized)) {
			const relativeToDest = dir.replace(sourceNormalized, '');
			const newPath = path.join(
				process.cwd(),
				'public',
				destination,
				relativeToDest,
				node.base
			);

			fsExtra.copy(node.absolutePath, newPath, err => {
				if (err) {
					console.error('Error copying file', err);
				}
			});
		}
	}
};
