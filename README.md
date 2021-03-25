# PLCNext

## SETTING UP PLC

1. Assign the IP address and project in PLCnext Engineer
1. Update the firmware via webm manager (`192.168.0.2/wbm`)
1. Build and load the PLC program
1. Go to ehmi page (`192.168.0.2`), fill out the plcId, hmacKey, and apiKey inputs.
1. Connect to the PLC with shell `ssh admin@192.168.0.2`
1. Create the root password `sudo passwd root` //enter PLC password
1. Switch to root: `su`

###PYTHON

1. Install pip on the plc (make sure you have an internet connection on the PLC).
   `curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py` then
   `python3 get-pip.py`
1. Install requests python package
   `python3 -m pip install requests`
1. Put the python script onto PLC (Filezilla or `scp app.py admin@192.168.0.2:app.py` from same directory as script)
1. Set crontab run
   `EDITOR=nano crontab -e` //ENTER
   `*/30 * * * * /usr/bin/python3 /opt/plcnext/app.py` //CTRL + X, Y, ENTER

###NODE WITH DOCKER (obselete)

1. From your computer's directory with setup.sh, send the script file: `scp script.sh admin@192.168.0.2:script.sh`
1. In the PLC shell (home directory), set access levels: `chmod +x script.sh`
1. Then run (make sure you are running as root): `bash /opt/plcnext/script.sh`

##### OR

1. Set the time `date -s "$(curl -s --head http://google.com | grep ^Date: | sed 's/Date: //g')"`
1. Download & install Docker `git clone https://github.com/PLCnext/Docker_GettingStarted.git`
1. `cd Docker_GettingStarted`
1. `chmod +x setup.sh`
1. Run Docker setup: `./setup.sh`
1. Pull the Docker image: `balena-engine pull anodamine/plcnext:14-alpine`
1. Start the Docker instance (with process variables) `balena-engine run -d --restart=always -e WEBHOOK_URL='<webhookurl>' -e PLC_URL='https://<PLC-ip-address>/_pxc_api/api/variables/?pathPrefix=Arp.Plc.Eclr/&paths=<var1>,<var2>,<etc>' -e CRON_SCHEDULE='*/30 * * * *' -e HMAC_KEY='<HMACKEY>' -e ID='<ID>' -e API_KEY='<APIKEY>' anodamine/plcnext:14-alpine`

<br/> 
 
### Helpful Shell Commands

Lists active containers
`balena-engine ps`

Lists all containers
`balena-engine ps -a`

List number of containers active
`balena-engine ps -q | xargs | wc -w`

Stop a container execution
`balena-engine stop <id of container>`

Stop all containers
`balena-engine stop $(balena-engine ps -a -q)`

Stop all containers via remote SSH
`ssh -t admin@10.0.0.241 'balena-engine stop $(balena-engine ps -a -q)'`

Prune all unused containers
`balena-engine system prune -a`

Prune all unused containers
`balena-engine system prune`

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
