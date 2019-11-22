const fs = require('fs').promises;
const captureWebsite = require('capture-website');
const path = require('path');


const themesDir = path.join(__dirname, 'themes');
const screenshotDir = path.join(__dirname, 'screenshots');

/**
 * Returns the names of all themes. This includes the `prism-` prefix.
 */
async function getThemes() {
	return (await fs.readdir(themesDir)).map(f => (/^.+(?=\.css$)/.exec(f) || [''])[0]).filter(f => f);
}

/**
 * Takes a screenshot of all themes overwriting the old ones.
 */
async function screenshotAllThemes() {
	for (const theme of await getThemes()) {
		await screenshotTheme(theme, true);
	}
}

/**
 * Takes a screenshot of themes which don't have one already.
 */
async function screenshotMissingThemes() {
	for (const theme of await getThemes()) {
		await screenshotTheme(theme, false);
	}
}

/**
 * Takes a screenshot of the given themes and saves the image file in the screenshot directory.
 *
 * __IMPORTANT:__ Screenshots have to be taken sequentially, one after an other, to prevent a memory leak.
 *
 * @param {string} theme
 * @param {boolean} overwrite
 */
async function screenshotTheme(theme, overwrite) {
	const file = `${screenshotDir}/${theme}.png`;

	if (await fs.stat(file).then(s => s.isFile()).catch(() => false)) {
		if (overwrite) {
			await fs.unlink(file);
		} else {
			return;
		}
	}

	await captureWebsite.file(screenshotDir + '/code.html', file, {
		defaultBackground: false,
		scaleFactor: 1,
		element: 'pre',
		styles: [
			await fs.readFile(`${themesDir}/${theme}.css`, 'utf-8')
		]
	});
}

exports.screenshot = screenshotMissingThemes;
exports['screenshot-all'] = screenshotAllThemes;
