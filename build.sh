#!/bin/bash
set -e

echo 'Installing Python dependencies...'
pip install -r requirements.txt

echo 'Starting Flask application...'
python app.py
