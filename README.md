# PLCNext

Install dependencies:

```bash
npm install
```

Posts the data to slack every minute with the cron job.

Update the following variables:

```js
const PLC_URL = process.env.PLC_URL || "<plc-url-here>";
const SLACK_URL = process.env.SLACK_URL || "<slack-url-here>";

// Default to every minute
const CRON_SHEDULE = process.env.CRON_SHEDULE || "* * * * *";
```

And run the app:

```bash
node index.js
```

### Docker

We can pull the Docker image with:

```bash
docker pull anodamine/plcnext:14-alpine
```

Or with [Balena Engine](https://www.balena.io/engine):

```bash
balena-engine pull anodamine/plcnext:14-alpine
```

And we can run it like so:

```bash
docker run -d -e SLACK_URL='<slack-url>' -e PLC_URL='<plc-url>' anodamine/plcnext:14-alpine
```

We can also set a custom cron time:

```bash
-e CRON_SHEDULE='*/60 * * * *'
```

#### Deploying to Docker Hub

```bash
docker login
```

We build Docker with:

```bash
docker build -t anodamine/plcnext:14-alpine .
```

We push Docker with:

```bash
docker push anodamine/plcnext:14-alpine
```
