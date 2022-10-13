import { v4 as uuidv4 } from 'uuid';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

let _uuid = cookies.get('uuid');

if (!_uuid) {
    _uuid = uuidv4();
    cookies.set('uuid', _uuid);
}

export const uuid = _uuid;