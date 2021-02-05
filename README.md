# PLCTest

Install dependencies:

```bash
npm install
```

### Running locally without a PLC device

Uses the [example-data.json](./example-data.json) file as the PLC's response.

Posts the data to slack every minute with the cron job.

Update the following variables:

```js
const PLC_URL = process.env.PLC_URL || '<plc-url-here>';
const SLACK_URL = process.env.SLACK_URL || '<slack-url-here>';

// Default to every minute
const CRON_SHEDULE = process.env.CRON_SHEDULE || '* * * * *';
```

And run the app:

```bash
node index.js
```

### Docker

Push commits to the `main` branch and it will be automatically built in [Docker Hub](https://hub.docker.com/r/duanebester/plcnext-slack-notify)

We can then pull the image with Docker

```bash
docker pull duanebester/plcnext-slack-notify:latest
```

Or with [Balena Engine](https://www.balena.io/engine):

```bash
balena-engine pull duanebester/plcnext-slack-notify:latest
```

And we can run it like so:

```bash
docker run -d -e SLACK_URL='<slack-url>' -e PLC_URL='<plc-url>' duanebester/plcnext-slack-notify:latest
```

We can also run the testing version (no real PLC device):

```bash
docker run -d -e SLACK_URL='<slack-url>' -e TESTING=true duanebester/plcnext-slack-notify:latest
```

We can also set a custom cron time:

```bash
-e CRON_SHEDULE='*/10 * * * *'
```