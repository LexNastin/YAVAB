const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

module.exports = {
	walk: async (dir) => {
		try {
			let files = await fs.readdir(dir);
			files = await Promise.all(files.map(async file => {
				const filePath = path.join(dir, file);
				const stats = await fs.stat(filePath);
				if (stats.isDirectory()) return module.exports.walk(filePath);
				else if(stats.isFile()) return filePath;
			}));

			return files.reduce((all, folderContents) => all.concat(folderContents), []);
		}
		catch(err) {
			console.log(chalk.bgRed.black(err));
		}
	}
}