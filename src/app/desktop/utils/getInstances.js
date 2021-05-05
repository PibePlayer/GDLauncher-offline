import path from 'path';
import fse from 'fs-extra';
import pMap from 'p-map';
import { getDirectories } from '.';
import { CURSEFORGE } from '../../../common/utils/constants';

const getInstances = async instancesPath => {
  const mapFolderToInstance = async instance => {
    try {
      const configPath = path.join(
        path.join(instancesPath, instance, 'config.json')
      );
      const config = await fse.readJSON(configPath);

      // if the launcher has the modloader as an array, convert it to object
      if (Array.isArray(config.modloader)) {
        // source is the source where the modpack comes from example: ftb
        // loaderType is the modloader example: forge
        const [
          loaderType,
          mcVersion,
          loaderVersion,
          projectID,
          fileID,
          source
        ] = config.modloader;

        const patchedConfig = {
          ...config,
          loader: {
            loaderType,
            mcVersion,
            ...(loaderVersion && { loaderVersion }),
            ...(fileID && { fileID }),
            ...(projectID && { projectID }),
            ...(!source && fileID && projectID && { source: CURSEFORGE })
          }
        };

        delete patchedConfig.modloader;

        await fse.writeFile(configPath, JSON.stringify(patchedConfig));

        return { ...patchedConfig, name: instance };
      }

      if (
        config.loader?.fileId ||
        config.loader?.addonId ||
        config.loader?.addonID
      ) {
        const { fileId, addonId, addonID } = config.loader;

        const patchedConfig = {
          ...config,
          loader: {
            ...config.loader,
            ...(fileId && { fileID: fileId }),
            ...(addonId && { projectID: addonId }),
            ...(addonID && { projectID: addonID })
          }
        };

        delete patchedConfig.loader.fileId;
        delete patchedConfig.loader.addonId;

        await fse.writeFile(configPath, JSON.stringify(patchedConfig));

        return { ...patchedConfig, name: instance };
      }

      return {
        ...config,
        name: instance
      };
    } catch (err) {
      console.error(err);
    }
    return null;
  };
  const folders = await getDirectories(instancesPath);
  const instances = await pMap(folders, mapFolderToInstance, {
    concurrency: 5
  });
  const hashMap = {};
  // eslint-disable-next-line
  for (const instance of instances) {
    // eslint-disable-next-line
    if (!instance) continue;
    hashMap[instance.name] = instance;
  }

  return hashMap;
};

export default getInstances;
