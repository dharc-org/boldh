import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import requests
import json
import re
import sys
import os

# debug
sys.stderr.write("Debug: This is a debug statement\n")

# PROCESSES THE CONTENTS OF MULTIVALUE CELLS
def agenda_json_builder(entries_list):
    for entry in entries_list:

        urls = entry['urls']
        pattern = r'^(.*?)\n(\[https://[^\n\]]+\])'
        urls_matches = re.findall(pattern, urls, re.MULTILINE)
        urls_result = [{'text':match[0].strip(), 'url':match[1].replace('[', '').replace(']', '')} for match in urls_matches]

        downloads = entry['downloads']
        downloads_matches = re.findall(pattern, downloads, re.MULTILINE)
        downloads_result = [{'text':match[0].strip(), 'url':match[1].replace('[', '').replace(']', '')} for match in downloads_matches]

        entry['urls'] = urls_result
        entry['downloads'] = downloads_result

    return entries_list

# EXTRACT DATA FROM THE SPREADSHEET
def get_data_from_sheet(document, sheet, file_name):

    # Get data from the chosen sheet
    values = sheet.get_all_values()

    # Assuming your sheet has a header row, extract column names
    headers = values[0]

    # Create a list of dictionaries representing each row
    data = [dict(zip(headers, row)) for row in values[1:]]

    # Convert data to DataFrame
    df = pd.DataFrame(data)

    # Convert DataFrame to list of dictionaries
    output_list = df.to_dict(orient='records')

    if 'agenda' in file_name:
        output_list = agenda_json_builder(output_list)

    # sort elements from latest to oldest
    output_list.reverse()

    # Convert list to JSON format
    json_el = json.dumps(output_list, indent=2)
    
    with open(f'content/{file_name}', 'w') as file:
        file.write(json_el)

    return json_el

# Load credentials and authorize the Google Sheets API
scope = ['https://spreadsheets.google.com/feeds']
creds_json_str = os.environ.get('GOOGLE_SHEETS_CREDS')
creds_dict = json.loads(creds_json_str)
creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)
client = gspread.authorize(creds)

# Open the Google Sheet using its ID
sheet_id = '1WKRWIkQ5qqr5caCEl5yaeHHuzDv_yF0fGpQs9dvBTgk'
document = client.open_by_key(sheet_id)

news = document.get_worksheet(0)
news_json = get_data_from_sheet(document, news, 'news.json')

agenda = document.get_worksheet(1)
agenda_json = get_data_from_sheet(document, agenda, 'agenda.json')

# Clear existing data in the Google Sheet
#sheet.clear()

# Update the Google Sheet with the new data
#sheet.update([df.columns.values.tolist()] + df.values.tolist())
