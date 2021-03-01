# PLCNext

## Setting up the PLC

1. Assign the IP address and project in PLCnext Engineer
1. Build and load the PLC program
1. Update the firmware via webm manager (ip address of PLC in browser)
1. Connect to the PLC via shell `ssh admin@10.0.0.241`
1. Create the root password `sudo passwd root` //enter PLC password
1. Switch to root: `su -`

##### THEN

1. From your computer's directory with setup.sh, send the script file: `scp script.sh admin@10.0.0.241:script.sh`
1. In the PLC shell (home directory), set access levels: `chmod +x script.sh`
1. Then run (make sure you are running as root): `bash /opt/plcnext/script.sh`

##### OR

1. Set the time `date -s "$(curl -s --head http://google.com | grep ^Date: | sed 's/Date: //g')"`
1. Download & install Docker `git clone https://github.com/PLCnext/Docker_GettingStarted.git`
1. `cd Docker_GettingStarted`
1. `chmod +x script.sh`
1. Run Docker setup: `./script.sh`
1. Pull the Docker image: `balena-engine pull anodamine/plcnext:14-alpine`
1. Start the Docker instance (with process variables) `balena-engine run -d -e WEBHOOK_URL='<webhookurl>' -e PLC_URL='<plc-url/ehmi/data.dictionary.json' -e HMAC_KEY='<hmac-key>' -e ID=$ID -e API_KEY='<api-key>' anodamine/plcnext:14-alpine`

<br/> 
 
## Helpful Shell Commands

Lists active containers
`balena-engine ps`

Lists all containers
`balena-engine ps -a`

Stop a container execution
`balena-engine stop <id of container>`

Stop all containers via remote SSH
`ssh -t admin@10.0.0.241 'balena-engine stop $(balena-engine ps -a -q)'`

<br/>
## Updating / Writing from VSCode

Install dependencies:

```bash
npm install
```

Posts the data to webhook every minute with the cron job.

Update the following variables:

```js
const PLC_URL = process.env.PLC_URL || "<plc-url-here>";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "<webhook-url-here>";

// Default to every minute
const CRON_SHEDULE = process.env.CRON_SHEDULE || "* * * * *";
```

We can also set a custom cron time:

```bash
-e CRON_SHEDULE='*/60 * * * *' //Every 60 min
```

And run the app:

```bash
node index.js
```

#### Deploying to Docker Hub

In your project directory:

```bash
docker login
```

We build Docker with:

```bash
docker build -t anodamine/plcnext:14-alpine .
```

We push Docker to DockerHub with:

```bash
docker push anodamine/plcnext:14-alpine
```
