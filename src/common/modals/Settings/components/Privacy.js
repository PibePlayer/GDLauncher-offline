import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import path from 'path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fsa from 'fs-extra';
import { promises as fs } from 'fs';
import { faNewspaper, faFolder } from '@fortawesome/free-solid-svg-icons';
import { Button, Switch, Input, Checkbox } from 'antd';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import {
  updateDiscordRPC,
  updateShowNews
} from '../../../reducers/settings/actions';

const PrivacyClass = styled.div`
  width: 100%;
  height: 100%;
`;

const PrivacyView = styled.div`
  margin-top: 38px;
  width: 100%;
`;

const MainTitle = styled.h1`
  color: ${props => props.theme.palette.text.primary};
  margin: 0 500px 20px 0;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.palette.text.primary};
  z-index: 1;
  text-align: left;
`;

const ListView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  p {
    text-align: left;
    color: ${props => props.theme.palette.text.third};
  }
`;

const CustomDataPathContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 140px;
  border-radius: ${props => props.theme.shape.borderRadius};

  h1 {
    width: 100%;
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme.palette.text.primary};
    z-index: 1;
    text-align: left;
  }
`;

const Privacy = () => {
  const DiscordRPC = useSelector(state => state.settings.discordRPC);
  const isPlaying = useSelector(state => state.startedInstances);
  const queuedInstances = useSelector(state => state.downloadQueue);
  const [deletingInstances] = useState(false);
  const userData = useSelector(state => state.userData);
  const [dataPath, setDataPath] = useState(userData);
  const [moveUserData, setMoveUserData] = useState(false);
  const showNews = useSelector(state => state.settings.showNews);
  const [loadingMoveUserData, setLoadingMoveUserData] = useState(false);
  const dispatch = useDispatch();

  const disableInstancesActions =
    Object.keys(queuedInstances).length > 0 ||
    Object.keys(isPlaying).length > 0;

  const changeDataPath = async () => {
    setLoadingMoveUserData(true);
    const appData = await ipcRenderer.invoke('getAppdataPath');
    const appDataPath = path.join(appData, 'koalalauncher');

    const notCopiedFiles = [
      'Cache',
      'Code Cache',
      'Dictionaries',
      'GPUCache',
      'Cookies',
      'Cookies-journal'
    ];
    await fsa.writeFile(path.join(appDataPath, 'override.data'), dataPath);

    if (moveUserData) {
      try {
        const files = await fs.readdir(userData);
        await Promise.all(
          files.map(async name => {
            if (!notCopiedFiles.includes(name)) {
              await fsa.copy(
                path.join(userData, name),
                path.join(dataPath, name),
                {
                  overwrite: true
                }
              );
            }
          })
        );
      } catch (e) {
        console.error(e);
      }
    }
    setLoadingMoveUserData(false);
    ipcRenderer.invoke('appRestart');
  };

  const openFolder = async () => {
    const { filePaths, canceled } = await ipcRenderer.invoke(
      'openFolderDialog',
      userData
    );
    if (!filePaths[0] || canceled) return;
    setDataPath(filePaths[0]);
  };

  return (
    <PrivacyClass>
      <PrivacyView>
        <MainTitle>Privacy</MainTitle>
        <Title
          css={`
            margin-top: 0px;
          `}
        >
          Discord Integration &nbsp; <FontAwesomeIcon icon={faDiscord} />
        </Title>
        <ListView>
          <p
            css={`
              width: 450px;
            `}
          >
            Enable Discord Integration. This displays what you are playing in
            Discord.
          </p>
          <Switch
            onChange={e => {
              dispatch(updateDiscordRPC(e));
              if (e) {
                ipcRenderer.invoke('init-discord-rpc');
              } else {
                ipcRenderer.invoke('shutdown-discord-rpc');
              }
            }}
            checked={DiscordRPC}
          />
        </ListView>
        <Title
          css={`
            margin-top: 20px;
          `}
        >
          Minecraft News &nbsp; <FontAwesomeIcon icon={faNewspaper} />
        </Title>
        <ListView>
          <p
            css={`
              width: 450px;
            `}
          >
            Enable the Minecraft News.
          </p>
          <Switch
            onChange={e => {
              dispatch(updateShowNews(e));
            }}
            checked={showNews}
          />
        </ListView>
        {/* {process.env.REACT_APP_RELEASE_TYPE === 'setup' && ( */}
        <CustomDataPathContainer>
          <Title
            css={`
              width: 400px;
              float: left;
            `}
          >
            User Data Path&nbsp; <FontAwesomeIcon icon={faFolder} />
            <a
              css={`
                margin-left: 30px;
              `}
              onClick={async () => {
                const appData = await ipcRenderer.invoke('getAppdataPath');
                const appDataPath = path.join(appData, 'koalalauncher');
                setDataPath(appDataPath);
              }}
            >
              Reset Path
            </a>
          </Title>
          <div
            css={`
              display: flex;
              justify-content: space-between;
              text-align: left;
              width: 100%;
              height: 32px;
              margin: 20px 0 10px 0;
              p {
                text-align: left;
                color: ${props => props.theme.palette.text.third};
              }
            `}
          >
            <Input
              value={dataPath}
              onChange={e => setDataPath(e.target.value)}
              disabled={
                loadingMoveUserData ||
                deletingInstances ||
                disableInstancesActions
              }
            />
            <Button
              css={`
                margin-left: 20px;
              `}
              onClick={openFolder}
              disabled={loadingMoveUserData || deletingInstances}
            >
              <FontAwesomeIcon icon={faFolder} />
            </Button>
            <Button
              css={`
                margin-left: 20px;
              `}
              onClick={changeDataPath}
              disabled={
                disableInstancesActions ||
                userData === dataPath ||
                !dataPath ||
                dataPath.length === 0 ||
                deletingInstances
              }
              loading={loadingMoveUserData}
            >
              Apply & Restart
            </Button>
          </div>
          <div
            css={`
              display: flex;
              justify-content: flex-start;
              width: 100%;
            `}
          >
            <Checkbox
              onChange={e => {
                setMoveUserData(e.target.checked);
              }}
            >
              Copy current data to the new directory
            </Checkbox>
          </div>
        </CustomDataPathContainer>
        {/* )} */}
      </PrivacyView>
    </PrivacyClass>
  );
};

export default memo(Privacy);
