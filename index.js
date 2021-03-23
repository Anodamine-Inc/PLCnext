const CronJob = require('cron').CronJob;
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');

const PLC_URL = process.env.PLC_URL || '<plc-url>';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '<api-url>';
// Defaults to every minute
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/30 * * * *';

const HMAC_KEY = process.env.HMAC_KEY;
const API_KEY = process.env.API_KEY;
const ID = process.env.ID;

const agent = new https.Agent({ rejectUnauthorized: false });

function getPlcData() {
    return axios.get(PLC_URL, { httpsAgent: agent }).then(res => {
        return res.data;
    })
    .catch(err => {
        console.log(err);
    });
};

function notifyWebhook(payload) {
    payload.plcId = ID;
    let dataString = JSON.stringify(payload);
    let hmac = crypto.createHmac('sha1', HMAC_KEY)
      .update(dataString)
      .digest('hex');
    
    let config = { params: { key: API_KEY }, headers: { 'Content-Type':'application/json', 'x-hmac': hmac } };

    axios.post(WEBHOOK_URL, payload, config)
        .then(res => {
            console.log('Notified webhook', res);
        })
        .catch(err => {
            console.log('Failed to notify webhook', err);
        });
    return;
}

const job = new CronJob(
	CRON_SCHEDULE,
	function() {
		console.log('Getting PLC Data...');
        try {
            getPlcData().then(data => notifyWebhook(data));
        } catch (err) {
            console.log(err);
        }
	}
);

job.start();
