const cron = require('node-cron');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');


const PLC_URL = process.env.PLC_URL || '<plc-url>';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '<api-url>';
// Defaults to every minute
const CRON_SHEDULE = process.env.CRON_SHEDULE || '* * * * *';

const HMAC_KEY = process.env.HMAC_KEY;
const API_KEY = process.env.API_KEY;
const ID = process.env.ID;

function getPlcData() {
    const agent = new https.Agent({  
        rejectUnauthorized: false
      });
    return axios.get(PLC_URL, { httpsAgent: agent}).then(res => {
        return res.data;
    })
    .catch(err => {
        console.log(err);
    });

};

function notifyWebhook(payload) {
    payload.id = ID;
    let dataString = JSON.stringify(payload);
    let hmac = crypto.createHmac('sha1', HMAC_KEY)
      .update(dataString)
      .digest('hex');
      
    axios.post(WEBHOOK_URL, payload, { params: { key: API_KEY }, headers: { 'Content-Type':'application/json', 'x-hmac': hmac } }).then(res => {
        console.log(res);
        console.log('Notified webhook')
    })
    .catch(err => {
        console.log(err);
    });
}

console.log('App has started... waiting for cron. - Duane Bester');

cron.schedule(CRON_SHEDULE, () => {
    console.log('Getting PLC Data...');
    getPlcData().then(data => notifyWebhook(data));
  });