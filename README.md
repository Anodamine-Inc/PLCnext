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
```

And run the app:

```bash
node index.js
```