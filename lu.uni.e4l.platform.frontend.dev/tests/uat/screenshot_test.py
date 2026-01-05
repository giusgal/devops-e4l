#!/usr/bin/env python3
"""
UAT: Take a screenshot of the calculator page on staging.
"""

import os
import sys
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

STAGING_URL = os.environ.get('STAGING_URL', 'http://172.17.0.1:8884')
SCREENSHOT_DIR = os.environ.get('SCREENSHOT_DIR', './screenshots')

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--window-size=1920,1080')

driver = None

try:
    driver = webdriver.Chrome(options=options)
    driver.get(f'{STAGING_URL}/calculator')
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, 'body'))
    )
    
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    screenshot_path = os.path.join(SCREENSHOT_DIR, f'calculator-{timestamp}.png')
    driver.save_screenshot(screenshot_path)
    
    print(f'Screenshot saved: {screenshot_path}')
    driver.quit()
    sys.exit(0)

except Exception as e:
    print(f'Test failed: {e}')
    if driver:
        driver.quit()
    sys.exit(1)
