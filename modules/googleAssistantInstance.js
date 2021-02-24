require('dotenv').config();
const GoogleAssistant = require('google-assistant');
const Auth = require('google-assistant/components/auth');
const OAuth2 = new (require('google-assistant/node_modules/google-auth-library'))().OAuth2;
const path = require('path');
const puppeteer = require('puppeteer');

module.exports = class googleAssistant {

	constructor(tokens, name, id) {
		this.ready = false
		this.promiseResolve;
		this.name = name;
		this.loading = false;
		this.id = id;
		this.tokens = tokens;

		// this.assistantAuth = {
		// 	keyFilePath: path.resolve(__dirname, '../exclude/client_secret_57395275052-jmu9hb6emovqpojiji4bpt50r12qhus0.apps.googleusercontent.com.json'),
		// 	savedTokensPath: path.resolve(__dirname, tokens)
		// }
	}

	async init() {
		const oauthClient = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
		let parsedTokens = JSON.parse(this.tokens);
		oauthClient.setCredentials(parsedTokens);

		this.assistant = new GoogleAssistant({oauth2Client: oauthClient});
		
		this.startConversation = (conversation) => {
			// setup the conversation and send data to it
			// for a full example, see `examples/mic-speaker.js`
		
			conversation
				.on('screen-data', (screen) => {
					(async () => {
						const browser = await puppeteer.launch();
						const page = await browser.newPage();
						await page.setViewport({ width: 1920, height: 1080 })
						await page.setContent(screen.data.toString());
						//await page.waitForXPath('//*[@id="assistant-card-content"]/div[2]/div/div')
						await new Promise(r => setTimeout(r, 1000));
						await page.screenshot({ path: `../google_out_${this.id}.png`, omitBackground: true })
						await browser.close();
						this.loading = false;
						this.promiseResolve();
					})();
				})
				.on('error', error => console.error(error))
		};
		
		this.assistant
			.on('ready', () => { this.ready = true; console.log(`${this.name} Ready!`); })
			.on('started', this.startConversation);
	}

	async sendCmd(cmd) {
		if(!this.ready) {
			console.log('not ready!')
			return;
		}

		return new Promise((resolve, reject) => {
			this.promiseResolve = resolve;
			this.loading = true;
			this.assistant.start({textQuery: cmd, isNew: false, screen: {isOn: true}});
		});
	}
}