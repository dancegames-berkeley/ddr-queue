from email.policy import default
from flask import Flask, send_from_directory, request
import firebase_admin
from firebase_admin import messaging
from requests import get

import json
import redis

from os import environ

firebase = firebase_admin.initialize_app()

redis = redis.Redis(decode_responses=True)

IS_DEV = 'FLASK_DEBUG' in environ
VITE_DEV_SERVER_HOST = 'http://localhost:5173'
CLIENT_DIR = '' if IS_DEV else environ['DDR_QUEUE_CLIENT_DIR']

API_KEY = environ['DDR_QUEUE_API_KEY']

app = Flask(__name__)

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

def broadcast():
    message = messaging.Message(
        data={'action': 'update'},
        topic='update'
    )

    messaging.send(message)

@app.route('/token', methods=['POST'])
def token():
    json = request.json

    uuid = json.get('uuid', None)
    token = json.get('token', None)

    if uuid is None:
        return 'Invalid uuid', 400
    
    if token is None:
        return 'Invalid token', 400
    
    messaging.subscribe_to_topic([token], 'update')

    redis.set(f'token::{uuid}', token)
    return 'Success'

@app.route('/queue-info', defaults={ 'uuid': None })
@app.route('/queue-info/<uuid>', methods=['GET'])
def queue_info(uuid):
    counter = None
    first_in_line = None
    pos_of_first_in_line = None

    if uuid is not None:
        counter = redis.get(f'counter::{uuid}')
    
    if counter is not None:
        first_in_line = redis.lindex('queue', 0)
    
    if first_in_line is not None:
        pos_of_first_in_line = redis.get(f'counter::{first_in_line}')
    
    pos_in_queue = (int(counter)-int(pos_of_first_in_line)+1) if counter is not None else None
    
    return json.dumps({
        'queue_size': redis.llen('queue'),
        'pos_in_queue': pos_in_queue
    })

@app.route('/join-queue', methods=['POST'])
def join_queue():
    json = request.json

    uuid = json.get('uuid', None)

    if uuid is None:
        return 'Invalid uuid', 400
    
    if not redis.exists(f'counter::{uuid}'):
        pipeline = redis.pipeline(True)
        pipeline.incr('counter')
        pipeline.rpush('queue', uuid)
        counter = pipeline.execute()[0]

        redis.set(f'counter::{uuid}', counter)

    broadcast()
    return queue_info(uuid)

@app.route('/dequeue', methods=['POST'])
def dequeue():
    key = request.form.get('key', None)

    if key != API_KEY:
        return 'Unauthorized', 401
    
    next_uuid = redis.lpop('queue')

    if next_uuid is None:
        return 'Queue empty'

    redis.delete(f'counter::{next_uuid}')

    token = redis.get(f'token::{next_uuid}')

    message = messaging.Message(
        notification=messaging.Notification('DDR Queue', "It's your turn!"),
        token=token
    )
    
    messaging.send(message)

    broadcast()

    return 'OK'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def client(path):
    if IS_DEV: return proxy(VITE_DEV_SERVER_HOST, path)
    return send_from_directory(CLIENT_DIR, path)