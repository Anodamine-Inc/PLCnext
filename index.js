const cron = require('node-cron');
const axios = require('axios');
const https = require('https');

const PLC_URL = process.env.PLC_URL || '<plc-url-here>';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '<webhook-url-here>';
// Defaults to every minute
const CRON_SHEDULE = process.env.CRON_SHEDULE || '* * * * *';


function getPlcData() {
    let data;
    const agent = new https.Agent({  
        rejectUnauthorized: false
      });
    axios.get(PLC_URL, { httpsAgent: agent}).then(res => {
        data = res.data;
    })
    .catch(err => {
        console.log(err);
    });
    return data;
}

function notifyWebhook(payload) {
    axios.post(WEBHOOK_URL, payload).then(res => {
        console.log('Notified webhook')
    })
    .catch(err => {
        console.log(err);
    });
}

console.log('App has started... waiting for cron. - Duane Bester');

cron.schedule(CRON_SHEDULE, () => {
  console.log('Getting PLC Data...');
  let plcData = getPlcData();
  if(plcData) {
    notifyWebhook(plcData);
  }
});