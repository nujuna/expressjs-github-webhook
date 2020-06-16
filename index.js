const express = require('express');
const bodyParser = require('body-parser');
const githubWebhook = require('express-github-webhook');
const { spawn } = require('child_process');

const host = '0.0.0.0';
const port = 9083;
const secret = 'secret'; // Secret key of the webhook
const path = '/home/user/path/';

// Create express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create middleware
const webhookHandler = githubWebhook({ path: '/webhook', secret });
app.use(webhookHandler);

app.get('/', (req, res) => {
	res.json({ "message": "Welcome to Express Github Webhook" });
});

webhookHandler.on('*', (event, repo, data) => {
	
	let deploy;

	// strapi-franchise
	if (repo == 'strapi-franchise') {
		console.log(`[${repo}] Request received`);

		// Branch master
		if (data.ref == 'refs/heads/master') {
			console.log(`[${repo}] Deploy branch master`);
			deploy = spawn('sh', [path + 'be.sh', 'master', 'sandbox'], { shell: true });
		}

		// Branch production
		if (data.ref == 'refs/heads/production') {
			console.log(`[${repo}] Deploy branch production`);
			deploy = spawn('sh', [path + 'be.sh', 'production', 'app'], { shell: true });
		}
	}

	// ng-franchise
	if (repo == 'ng-franchise') {
		console.log(`[${repo}] Request received`);

		// Branch dev
		if (data.ref == 'refs/heads/dev') {
			console.log(`[${repo}] Deploy branch dev`);
			deploy = spawn('sh', [path + 'fe.sh', 'dev', 'dev'], { shell: true });
		}

		// Branch production
		if (data.ref == 'refs/heads/production') {
			console.log(`[${repo}] Deploy branch production`);
			deploy = spawn('sh', [path + 'fe.sh', 'production', 'my'], { shell: true });
		}
	}

	if (data.ref) {
		let buff;
		deploy.stdout.on('data', data => {
			buff = new Buffer(data);
			console.log('[STDOUT]', buff.toString('utf-8'));
		});

		deploy.stderr.on('data', data => {
			buff = new Buffer(data);
			console.log('[STDERR]', buff.toString('utf-8'));
		});

		deploy.on('close', data => {
			buff = new Buffer(data);
			console.log('[CLOSE]', buff.toString('utf-8'));
		});
	}

	console.log(`[${repo}] Done`);

});

webhookHandler.on('error', (err, req, res) => {
	res.status(400).send({
		message: "An error occurred"
	});
});

app.listen(port, host, () => {
	console.log(`Server is listening on port ${host}:${port}`);
});
