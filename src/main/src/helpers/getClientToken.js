import { machineId } from 'node-machine-id';
import { DB_SCHEMA } from 'src/common/persistedKeys';
import { v5 as uuid } from 'uuid';
import { DB_INSTANCE } from '../config';

const UID_NAMESPACE = '1dfd2800-790c-11ea-a17c-e930c253ce6b';
const getClientToken = async () => {
  let clientToken;
  try {
    clientToken = await DB_INSTANCE.get(DB_SCHEMA.clientToken);
  } catch {
    const machineUuid = await machineId();
    clientToken = uuid(machineUuid, UID_NAMESPACE);
    await DB_INSTANCE.update(DB_SCHEMA.clientToken, clientToken);
  }
  return clientToken;
};

export default getClientToken;
