require('dotenv').config();

async function test() {

	process.env.ENBALE_ASSISTANT == '1' ? console.log('yes') : console.log('no');

}

test()