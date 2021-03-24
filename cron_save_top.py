"""
The script calls the bashcommands top and netstat and flush the stream into the file /opt/plcnext/logs/top_net_logfile.txt

Handle the script as follows:
1. Connect to the PLC via SCP (e.g. WinSCP) and deploy the script e.g. in the default working directory (/opt/plcnext)
2. The script collects also some system logs. To access them are root privleges required. Please login as "root"
3a. Open a shell interface (e.g with putty) and call "python3 cron_save_top.py", the file will be imidiatly created
3b. As the script works in 2a only as long as the shell session is active, it might be useful to execute the script in the background by using the option "nohup python3 cron_save_top.py
In that case is the script active as long as the PLC is runniung.

Note:
Depending on the called commands (like accessing /var/log/messages) were root priveleges necessary.
Login as root or switch to root user with "su"
"""


import subprocess
import time, threading
from datetime import date

log_interval = 30 #in seconds

Logfilename = "/opt/plcnext/logs/top_net_logfile.txt"


def log_top():
    #adds a header with date/time
    with open(Logfilename, "a") as diagfile:
        diagfile.write("\n\nDebug print {0}, configured interval {1}s\n\n".format(time.strftime("%b %d %Y %H:%M:%S",time.localtime()),log_interval))

    #calls the bash commands which appends to the file
    p = subprocess.Popen("ps --sort -rss -eo pid,pmem,rss,vsz,comm | head -16 >> " + Logfilename, shell=True)
    p = subprocess.Popen("top -H -b -n 1 | head -30 >> " + Logfilename, shell=True)
    p = subprocess.Popen("netstat -atu >>" + Logfilename, shell=True)
    p = subprocess.Popen("df -hal >> " + Logfilename, shell=True)
    p = subprocess.Popen("tail /var/log/messages >> " + Logfilename, shell=True)
    p = subprocess.Popen("xxd -l 0x4 /dev/mram0 >> " + Logfilename, shell=True)        
    
    #calls the func in the configured interval
    threading.Timer(log_interval, log_top).start()

log_top()