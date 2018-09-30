import path from 'path';
import { message } from 'antd';
import { promisify } from 'util';
import axios from 'axios';
import makeDir from 'make-dir';
import fs from 'fs';
import _ from 'lodash';
import Zip from 'adm-zip';
import { downloadFile, downloadArr } from '../utils/downloader';
import { PACKS_PATH, INSTANCES_PATH, META_PATH } from '../constants';
import { extractAssets, extractMainJar, extractNatives, computeVanillaAndForgeLibraries } from '../utils/getMCFilesList';

export const START_DOWNLOAD = 'START_DOWNLOAD';
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';
export const DOWNLOAD_COMPLETED = 'DOWNLOAD_COMPLETED';
export const DOWNLOAD_FILE_COMPLETED = 'DOWNLOAD_FILE_COMPLETED';
export const UPDATE_TOTAL_FILES_TO_DOWNLOAD = 'UPDATE_TOTAL_FILES_TO_DOWNLOAD';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

export function addToQueue(pack, version, forgeVersion = null) {
  return (dispatch, getState) => {
    const { downloadManager } = getState();
    dispatch({
      type: ADD_TO_QUEUE,
      payload: pack,
      version,
      forgeVersion
    });
    if (downloadManager.actualDownload === null) {
      dispatch({
        type: START_DOWNLOAD,
        payload: pack
      });
      dispatch(downloadPack(pack));
    }
  };
}

export function clearQueue() {
  // This needs to clear any instance that is already installed
  return (dispatch, getState) => {
    const { downloadManager } = getState();
    const completed = Object.keys(downloadManager.downloadQueue).filter(act => downloadManager.downloadQueue[act].status === 'Completed');
    // It makes no sense to dispatch if no instance is to remove
    if (completed.length !== 0) {
      dispatch({
        type: CLEAR_QUEUE,
        payload: completed
      });
    }
  };
}

export function downloadPack(pack) {
  return async (dispatch, getState) => {
    const { downloadManager, packCreator } = getState();
    const currPack = downloadManager.downloadQueue[pack];
    let vnlJSON = null;
    try {
      vnlJSON = JSON.parse(await promisify(fs.readFile)(path.join(META_PATH, 'net.minecraft', currPack.version, `${currPack.version}.json`)));
    } catch (err) {
      const versionURL = packCreator.versionsManifest.find((v) => v.id === currPack.version).url;
      vnlJSON = (await axios.get(versionURL)).data;
      await makeDir(path.join(META_PATH, 'net.minecraft', currPack.version));
      await promisify(fs.writeFile)(path.join(META_PATH, 'net.minecraft', currPack.version, `${currPack.version}.json`), JSON.stringify(vnlJSON));
    }

    let forgeJSON = null;

    const assets = await extractAssets(vnlJSON);
    const mainJar = await extractMainJar(vnlJSON);

    let forgeFileName = `${currPack.version}-${currPack.forgeVersion}`;
    if (currPack.forgeVersion !== null) {
      const forgeUrl = `https://files.minecraftforge.net/maven/net/minecraftforge/forge/${forgeFileName}/forge-${forgeFileName}-universal.jar`;

      // Checks whether the filename is version-forge or version-forge-version
      try { await axios.head(forgeUrl) }
      catch (err) { forgeFileName = `${currPack.version}-${currPack.forgeVersion}-${currPack.version}-` }

      const forgePath = path.join(INSTANCES_PATH, 'libraries', 'net', 'minecraftforge', 'forge', forgeFileName, `forge-${forgeFileName}.jar`);
      try {
        forgeJSON = JSON.parse(await promisify(fs.readFile)(path.join(META_PATH, 'net.minecraftforge', forgeFileName, `${forgeFileName}.json`)));
        await promisify(fs.access)(forgePath);
      } catch (err) {
        await makeDir(path.dirname(forgePath));
        await downloadFile(forgePath, forgeUrl, (p) => {
          dispatch({ type: UPDATE_PROGRESS, payload: { pack, percentage: p } });
        });
        const zipFile = new Zip(forgePath);
        forgeJSON = JSON.parse(zipFile.readAsText("version.json"));
        await makeDir(path.join(META_PATH, 'net.minecraftforge', forgeFileName));
        await promisify(fs.writeFile)(path.join(META_PATH, 'net.minecraftforge', forgeFileName, `${forgeFileName}.json`), JSON.stringify(forgeJSON));
      }
    }

    const libraries = await computeVanillaAndForgeLibraries(vnlJSON, forgeJSON);

    // This is the main config file for the instance
    await promisify(fs.writeFile)(path.join(PACKS_PATH, pack, 'config.json'), JSON.stringify({
      instanceName: pack,
      version: currPack.version,
      forgeVersion: currPack.forgeVersion !== null ? forgeFileName : null,
    }));

    dispatch({
      type: UPDATE_TOTAL_FILES_TO_DOWNLOAD,
      payload: {
        pack,
        total: libraries.length + assets.length + mainJar.length
      }
    });

    await downloadArr(libraries.filter(lib => !lib.path.includes('minecraftforge')), path.join(INSTANCES_PATH, 'libraries'), dispatch, pack);

    await downloadArr(assets, path.join(INSTANCES_PATH, 'assets'), dispatch, pack, 10);

    await downloadArr(mainJar, path.join(INSTANCES_PATH, 'versions'), dispatch, pack);

    await extractNatives(libraries.filter(lib => 'natives' in lib), pack);

    dispatch({
      type: DOWNLOAD_COMPLETED,
      payload: pack
    });
    message.success(`${pack} has been downloaded!`);
    dispatch(addNextPackToActualDownload());
  };
}

function addNextPackToActualDownload() {
  return (dispatch, getState) => {
    const { downloadManager } = getState();
    const queueArr = Object.keys(downloadManager.downloadQueue);
    queueArr.some(pack => {
      if (downloadManager.downloadQueue[pack].status !== 'Completed') {
        dispatch({
          type: START_DOWNLOAD,
          payload: pack
        });
        dispatch(downloadPack(pack));
        return true;
      }
      return false;
    });
  };
}