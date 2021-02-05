const cron = require('node-cron');
const axios = require('axios');

const PLC_URL = process.env.PLC_URL || '<plc-url-here>';
const SLACK_URL = process.env.SLACK_URL || '<slack-url-here>';
// Default to every minute
const CRON_SHEDULE = process.env.CRON_SHEDULE || '* * * * *';


function getPlcData() {
    let data;
    axios.get(PLC_URL).then(res => {
        data = res.data;
    })
    .catch(err => {
        console.log(err);
    });
    return data;
}

function notifySlack(message) {
    axios.post(SLACK_URL, {text: message}).then(res => {
        data = res.data;
    })
    .catch(err => {
        console.log(err);
    });
}

console.log('App has started... waiting for cron.');
cron.schedule(CRON_SHEDULE, () => {
  console.log('Getting PLC Data...');
  let plcData = getPlcData(true);
  if(plcData) {
      console.log('Sending data to Slack...');
      let message = '```' + JSON.stringify(plcData,null,2) + '```';
      notifySlack(message);
  }
});