from flask import Blueprint, request

import json
import redis

from firebase_admin import messaging

redis = redis.Redis(decode_responses=True)

queue = Blueprint('queue', __name__)

def broadcast():
    message = messaging.Message(
        data={'action': 'update'},
        topic='update'
    )

    messaging.send(message)

@queue.route('/token', methods=['POST'])
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

@queue.route('/queue-info', defaults={ 'uuid': None })
@queue.route('/queue-info/<uuid>', methods=['GET'])
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

@queue.route('/join-queue', methods=['POST'])
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

@queue.route('/dequeue', methods=['POST'])
def dequeue():
    key = request.form.get('key', None)

    apikey = redis.get('apikey')

    if apikey is None or key != apikey:
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