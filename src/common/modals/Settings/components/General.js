import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { ipcRenderer, clipboard } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import path from 'path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fsa from 'fs-extra';
import {
  faCopy,
  faDownload,
  faTachometerAlt,
  faToilet,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import { Select, Tooltip, Button, Switch } from 'antd';
import { _getCurrentAccount } from '../../../utils/selectors';
import {
  updatePotatoPcMode,
  updateCurseReleaseChannel
} from '../../../reducers/settings/actions';
import HorizontalLogo from '../../../../ui/HorizontalLogo.png';
import { updateConcurrentDownloads } from '../../../reducers/actions';
import { openModal } from '../../../reducers/modals/actions';
import { extractFace } from '../../../../app/desktop/utils';

const MyAccountPrf = styled.div`
  width: 100%;
  height: 100%;
`;

const PersonalData = styled.div`
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

const ProfileImage = styled.img`
  position: relative;
  top: 20px;
  left: 20px;
  background: #3d3d3d;
  width: 50px;
  height: 50px;
`;

const ImagePlaceHolder = styled.div`
  position: relative;
  top: 20px;
  left: 20px;
  background: #3d3d3d;
  width: 50px;
  height: 50px;
`;

const UsernameContainer = styled.div`
  text-align: left;
`;

const UuidContainer = styled.div`
  text-align: left;
`;

const Uuid = styled.div`
  font-size: smaller;
  font-weight: 200;
  color: ${props => props.theme.palette.grey[100]};
  display: flex;
`;

const Username = styled.div`
  font-size: smaller;
  font-weight: 200;
  color: ${props => props.theme.palette.grey[100]};
  display: flex;
`;

const PersonalDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: ${props => props.theme.palette.grey[900]};
  border-radius: ${props => props.theme.shape.borderRadius};
`;

const Hr = styled.div`
  height: 25px;
`;

const ReleaseChannel = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  height: 90px;
  color: ${props => props.theme.palette.text.third};
  p {
    margin-bottom: 7px;
    color: ${props => props.theme.palette.text.secondary};
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  select {
    margin-left: auto;
    self-align: end;
  }
`;

const ParallelDownload = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  p {
    text-align: left;
    color: ${props => props.theme.palette.text.third};
  }
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

const LauncherVersion = styled.div`
  margin: 30px 0;
  p {
    text-align: left;
    color: ${props => props.theme.palette.text.third};
    margin: 0 0 0 6px;
  }

  h1 {
    color: ${props => props.theme.palette.text.primary};
  }
`;

function copy(setCopied, copyText) {
  setCopied(true);
  clipboard.writeText(copyText);
  setTimeout(() => {
    setCopied(false);
  }, 500);
}

function dashUuid(UUID) {
  // UUID is segmented into: 8 - 4 - 4 - 4 - 12
  // Then dashes are added between.

  // eslint-disable-next-line
  return `${UUID.substring(0, 8)}-${UUID.substring(8, 12)}-${UUID.substring(
    12,
    16
  )}-${UUID.substring(16, 20)}-${UUID.substring(20, 32)}`;
}

const General = () => {
  const [version, setVersion] = useState(null);
  const [releaseChannel, setReleaseChannel] = useState(null);
  const currentAccount = useSelector(_getCurrentAccount);

  const potatoPcMode = useSelector(state => state.settings.potatoPcMode);
  const concurrentDownloads = useSelector(
    state => state.settings.concurrentDownloads
  );
  const updateAvailable = useSelector(state => state.updateAvailable);
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const curseReleaseChannel = useSelector(
    state => state.settings.curseReleaseChannel
  );

  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.invoke('getAppVersion').then(setVersion).catch(console.error);
    extractFace(currentAccount.skin).then(setProfileImage).catch(console.error);
    ipcRenderer
      .invoke('getAppdataPath')
      .then(appData =>
        fsa
          .readFile(path.join(appData, 'koalalauncher', 'rChannel'))
          .then(v => setReleaseChannel(parseInt(v.toString(), 10)))
          .catch(() => setReleaseChannel(0))
      )
      .catch(console.error);
  }, []);

  return (
    <MyAccountPrf>
      <PersonalData>
        <MainTitle>General</MainTitle>
        <PersonalDataContainer>
          {profileImage ? (
            <ProfileImage src={`data:image/jpeg;base64,${profileImage}`} />
          ) : (
            <ImagePlaceHolder />
          )}
          <div
            css={`
              margin: 20px 20px 20px 40px;
              width: 330px;
            `}
          >
            <UsernameContainer>
              Username <br />
              <Username>{currentAccount.selectedProfile.name}</Username>
            </UsernameContainer>
            <UuidContainer>
              UUID
              <br />
              <Uuid>
                {dashUuid(currentAccount.selectedProfile.id)}
                <Tooltip title={copiedUuid ? 'Copied' : 'Copy'} placement="top">
                  <div
                    css={`
                      width: 13px;
                      height: 14px;
                      margin: 0;
                      margin-left: 10px;
                    `}
                  >
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={() =>
                        copy(
                          setCopiedUuid,
                          dashUuid(currentAccount.selectedProfile.id)
                        )
                      }
                    />
                  </div>
                </Tooltip>
              </Uuid>
            </UuidContainer>
          </div>
        </PersonalDataContainer>
      </PersonalData>
      <Hr />
      <ReleaseChannel>
        <Title>Release Channel</Title>
        <div>
          <div
            css={`
              width: 450px;
            `}
          >
            Stable updates once a month, beta does update more often but it may
            have more bugs.
          </div>
          <Select
            css={`
              width: 100px;
            `}
            onChange={async e => {
              const appData = await ipcRenderer.invoke('getAppdataPath');
              setReleaseChannel(e);
              await fsa.writeFile(
                path.join(appData, 'koalalauncher', 'rChannel'),
                e
              );
            }}
            value={releaseChannel}
          >
            <Select.Option value={0}>Stable</Select.Option>
            <Select.Option value={1}>Beta</Select.Option>
          </Select>
        </div>
      </ReleaseChannel>
      <Title
        css={`
          margin-top: 5px;
        `}
      >
        Concurrent Downloads &nbsp; <FontAwesomeIcon icon={faTachometerAlt} />
      </Title>
      <ParallelDownload>
        <p
          css={`
            margin: 0;
            width: 450px;
          `}
        >
          Select the number of concurrent downloads. If you have a slow
          connection, select max 3
        </p>

        <Select
          onChange={v => dispatch(updateConcurrentDownloads(v))}
          value={concurrentDownloads}
          css={`
            width: 100px;
            text-align: start;
          `}
        >
          {[...Array(100).keys()]
            .map(x => x + 1)
            .map(x => (
              <Select.Option key={x} value={x}>
                {x}
              </Select.Option>
            ))}
        </Select>
      </ParallelDownload>
      <Hr />
      <Title>
        Preferred CurseForge Release Channel &nbsp;{' '}
        <FontAwesomeIcon icon={faFire} />
      </Title>
      <ParallelDownload>
        <p
          css={`
            margin: 0;
            width: 450px;
          `}
        >
          Select the preferred release channel for downloading CurseForge
          projects. This also applies for mods update.
        </p>
        <Select
          css={`
            width: 100px;
            text-align: start;
          `}
          onChange={e => dispatch(updateCurseReleaseChannel(e))}
          value={curseReleaseChannel}
        >
          <Select.Option value={1}>Stable</Select.Option>
          <Select.Option value={2}>Beta</Select.Option>
          <Select.Option value={3}>Alpha</Select.Option>
        </Select>
      </ParallelDownload>
      <Hr />
      <Title
        css={`
          margin-top: 5px;
        `}
      >
        Potato PC Mode &nbsp; <FontAwesomeIcon icon={faToilet} />
      </Title>
      <ListView
        css={`
          margin-bottom: 10px;
        `}
      >
        <p
          css={`
            width: 500px;
          `}
        >
          You got a potato PC? Don&apos;t worry! We got you covered. Enable this
          and all animations and special effects will be disabled
        </p>
        <Switch
          onChange={e => {
            dispatch(updatePotatoPcMode(e));
          }}
          checked={potatoPcMode}
        />
      </ListView>
      <Hr />
      <LauncherVersion>
        <div
          css={`
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
          `}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <img
            src={HorizontalLogo}
            height="128px"
            width="311px"
            alt="Logo"
            draggable="false"
            onClick={() => dispatch(openModal('Changelogs'))}
            pointerCursor
          />{' '}
        </div>
        <div
          css={`
            margin-top: -40px;
            margin-left: 230px;
            margin-bottom: 50px;
            color: #6c5d53;
            font-size: 18px;
          `}
        >
          <p>v{version}</p>
        </div>
        <p>
          {updateAvailable
            ? 'There is an update available to be installed. Click on update to install it and restart the launcher'
            : 'You’re currently on the latest version. We automatically check for updates and we will inform you whenever one is available'}
        </p>
        <div
          css={`
            margin-top: 5px;
            height: 36px;
            display: flex;
            flex-direction: row;
          `}
        >
          {updateAvailable ? (
            <Button
              onClick={() =>
                ipcRenderer.invoke('installUpdateAndQuitOrRestart')
              }
              css={`
                margin-right: 10px;
              `}
              type="primary"
            >
              Update &nbsp;
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          ) : (
            <div
              css={`
                width: 96px;
                height: 36px;
                padding: 6px 8px;
              `}
            >
              Up to date
            </div>
          )}
        </div>
      </LauncherVersion>
    </MyAccountPrf>
  );
};

export default memo(General);
