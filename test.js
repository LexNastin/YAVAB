const { walk } = require('./walk.js');

async function test() {

	let interactions = await walk('./interactions/').catch((err) => {error(err);});
	let intermediate = [];
	let final = {};

	interactions.forEach(interaction => {
		let temp = interaction.split('\\');
		temp.shift()

		intermediate.push(temp);
	})
	console.log(intermediate)

}

test()