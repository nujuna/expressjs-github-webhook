const express = require('express');
const bodyParser = require('body-parser');
const githubWebhook = require('express-github-webhook');
const spawn = require('child_process').spawn;

const host = '0.0.0.0';
const port = 9083;
const secret = 'secret'; // Secret key of the webhook

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
			deploy = spawn('sh', ['be.sh', 'master', 'sandbox']);
		}

		// Branch production
		if (data.ref == 'refs/heads/production') {
			console.log(`[${repo}] Deploy branch production`);
			deploy = spawn('sh', ['be.sh', 'production', 'app']);
		}
	}

	// ng-franchise
	if (repo == 'ng-franchise') {
		console.log(`[${repo}] Request received`);

		// Branch dev
		if (data.ref == 'refs/heads/dev') {
			console.log(`[${repo}] Deploy branch dev`);
			deploy = spawn('sh', ['fe.sh', 'dev', 'dev']);
		}

		// Branch production
		if (data.ref == 'refs/heads/production') {
			console.log(`[${repo}] Deploy branch production`);
			deploy = spawn('sh', ['fe.sh', 'production', 'my']);
		}
	}

	deploy.stdout.on('data', data => {
		const buff = new Buffer(data);
		console.log(buff.toString('utf-8'));
	});

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
