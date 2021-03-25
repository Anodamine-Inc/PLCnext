import requests
import urllib3
import json
import hashlib
import hmac

PLC_URL = 'https://localhost/_pxc_api/api/variables/?pathPrefix=Arp.Plc.Eclr/&paths=EHMI_plcId,EHMI_hmacKey,EHMI_apiKey,PRC_P1_On,PRC_P1_Enabled,PRC_P2_On,PRC_P2_Enabled,PRC_P1_AutoControl,PRC_P2_AutoControl,PRC_P1_DosageRate,PRC_P2_DosageRate,PRC_P1_TotalDosed_Liters,PRC_P2_TotalDosed_Liters,PRC_P1_MotorFreq,PRC_P2_MotorFreq,PRC_P1_Alarm,PRC_P2_Alarm,PRC_Level_Liters,PRC_Level_mm,PRC_Low_Level_Setpoint_Percent,PRC_Stats_Counter_Batches,PRC_Stats_TotalVolumeInjected_Liters,PRC_Stats_Counter_P1_Starts,PRC_Stats_Counter_P2_Starts,PRC_AI_1,PRC_AI_2,PRC_Stroke_Setting,PRC_Pump_Max_mL_min,PRC_Pressure_PSI,PRC_Low_Level_Setpoint_Percent,PRC_P1_TotalRunTime,PRC_P2_TotalRunTime,PRC_TotalPLCTime'
WEBHOOK_URL = 'https://plc.anodamine.com/api/v1/data'

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_plc_data(plc_url):
    # TESTING PURPOSES
    # fObj = open('example-data.json',)
    # data = json.load(fObj)
    # return data
    resp = requests.get(plc_url, verify=False)
    if resp.status_code == 200:
        parsed = json.loads(resp.content, parse_float=lambda x: str(x))
        return parsed
    else:
        return None

def get_payload(data):
    plcId = data['variables'][0]['value']
    hmacKey = data['variables'][1]['value']
    apiKey = data['variables'][2]['value'] 
    data['plcId'] = plcId
    return data, hmacKey, apiKey

def create_hmac(message, key):
    key = bytes(key, 'UTF-8')
    message = bytes(message, 'UTF-8')
    digester = hmac.new(key, message, hashlib.sha1)
    signature = digester.hexdigest()
    return signature

def notify_webhook(webhook_url, payload, hmac_key, api_key):
    payload_str = json.dumps(payload, separators=(',', ':'))
    hmac_header = create_hmac(payload_str, hmac_key)
    headers = { 'content-type': 'application/json', 'x-hmac': hmac_header }
    params = { 'key': api_key }
    r = requests.post(webhook_url, params=params, json=payload, headers=headers)
    return r


data = get_plc_data(PLC_URL)
if data is None:
    print("Bad PLC Data - Not notifying webhook")
else:
    payload, hmac_key, api_key = get_payload(data)
    resp = notify_webhook(WEBHOOK_URL, payload, hmac_key, api_key)
    print(resp.status_code)
    print(resp.content)