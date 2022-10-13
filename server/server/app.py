from flask import Flask, send_from_directory
import firebase_admin
from requests import get

from os import environ

from server.queue import queue

firebase = firebase_admin.initialize_app()

IS_DEV = 'FLASK_DEBUG' in environ
VITE_DEV_SERVER_HOST = 'http://localhost:5173'
CLIENT_DIR = '' if IS_DEV else environ['DDR_QUEUE_CLIENT_DIR']

app = Flask(__name__)
app.register_blueprint(queue)

def proxy(host, path):
    response = get(f'{host}/{path}')
    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = {
        name: value
        for name, value in response.raw.headers.items()
        if name.lower() not in excluded_headers
    }
    return (response.content, response.status_code, headers)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def client(path):
    if IS_DEV: return proxy(VITE_DEV_SERVER_HOST, path)
    return send_from_directory(CLIENT_DIR, path)