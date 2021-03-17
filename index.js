const cron = require('node-cron');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const { exec } = require('child_process');


const PLC_URL = process.env.PLC_URL || '<plc-url>';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '<api-url>';
// Defaults to every minute
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/30 * * * *';

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

function getPlcStats() {
    try {
        const cpu = exec(`top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}'`);
        const memory = exec(`free -m | awk 'NR==2{printf "%.2f\n",$3*100/$2 }'`);
        const numContainers = exec(`balena-engine ps --filter="name=anodamine-plcnext" -q | xargs`);
        return { cpu, memory, numContainers };
    } catch (err) {
        console.log(err);
    }
};


function notifyWebhook(payload, endpoint) {
    payload.plcId = ID;
    let dataString = JSON.stringify(payload);
    let hmac = crypto.createHmac('sha1', HMAC_KEY)
      .update(dataString)
      .digest('hex');
      
    axios.post(WEBHOOK_URL + endpoint, payload, { params: { key: API_KEY }, headers: { 'Content-Type':'application/json', 'x-hmac': hmac } }).then(res => {
        console.log('Notified webhook')
    })
    .catch(err => {
        console.log(err);
    });
}

console.log('App has started... waiting for cron.');

cron.schedule(CRON_SCHEDULE, () => {
    console.log('Getting PLC Data...');
    try {
        let stats = getPlcStats();
        notifyWebhook(stats, '/stats');
        getPlcData().then(data => notifyWebhook(data, '/data));
    } catch (err) {
        console.log(err);
    }
});
