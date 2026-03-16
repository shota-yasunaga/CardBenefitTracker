#!/usr/bin/env python3
"""Serve the Card Benefit Tracker at http://localhost:8000"""

import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8000
DIR = Path(__file__).resolve().parent

# Serve from the script's directory so paths work correctly
import os
os.chdir(DIR)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"Serving at {url}")
    print(f"Press Ctrl+C to stop")
    webbrowser.open(url)
    httpd.serve_forever()
