import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import {
  faMemory,
  faFolder,
  faUndo,
  faList
} from '@fortawesome/free-solid-svg-icons';
import { Slider, Button, Input, Switch } from 'antd';
import {
  updateJavaArguments,
  updateJavaMemory,
  updateJavaPath
} from '../../../reducers/settings/actions';
import { DEFAULT_JAVA_ARGS } from '../../../../app/desktop/utils/constants';
import { _getJavaPath } from '../../../utils/selectors';
import { openModal } from '../../../reducers/modals/actions';

const JavaSettings = styled.div`
  width: 100%;
  height: 400px;
`;

const AutodetectPath = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 40px;
`;

const SelectMemory = styled.div`
  width: 100%;
  height: 100px;
`;

const JavaCustomArguments = styled.div`
  width: 100%;
  height: 120px;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.palette.text.secondary};
`;

const Paragraph = styled.p`
  color: ${props => props.theme.palette.text.third};
`;

const Hr = styled.div`
  height: 35px;
`;

const MainTitle = styled.h1`
  color: ${props => props.theme.palette.text.primary};
  width: 80px;
  margin: 30px 0 20px 0;
`;

const StyledButtons = styled(Button)`
  float: right;
`;

function resetJavaArguments(dispatch) {
  dispatch(updateJavaArguments(DEFAULT_JAVA_ARGS));
}

const marks = {
  2048: '2GiB',
  4096: '4GiB',
  6114: '6GiB',
  8192: '8GiB',
  10240: '10GiB',
  12288: '12GiB',
  14336: '14GiB',
  16384: '16GiB'
};

export default function MyAccountPreferences() {
  const javaArgs = useSelector(state => state.settings.java.args);
  const javaMemory = useSelector(state => state.settings.java.memory);
  const javaPath = useSelector(_getJavaPath);
  const customJavaPath = useSelector(state => state.settings.java.path);

  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.invoke('getAllDisplaysBounds').catch(console.error);
  }, []);

  return (
    <JavaSettings>
      <MainTitle>Java</MainTitle>
      <Title
        css={`
          width: 500px;
          text-align: left;
        `}
      >
        Autodetect Java Path&nbsp; <FontAwesomeIcon icon={faJava} />
        <a
          css={`
            margin-left: 30px;
          `}
          onClick={() => {
            dispatch(openModal('JavaSetup'));
          }}
        >
          Run Java Setup again
        </a>
      </Title>
      <AutodetectPath>
        <Paragraph
          css={`
            text-align: left;
          `}
        >
          Disable this to specify a custom Java version instead of using the
          shipped one. Select the Java binary file.
        </Paragraph>
        <Switch
          color="primary"
          onChange={c => {
            if (c) {
              dispatch(updateJavaPath(null));
            } else {
              dispatch(updateJavaPath(javaPath));
            }
          }}
          checked={!customJavaPath}
        />
      </AutodetectPath>
      {customJavaPath && (
        <>
          <div
            css={`
              height: 40px;
            `}
          >
            <div
              css={`
                width: 100%;
                margin: 10px 0px;
              `}
            >
              <Input
                css={`
                  width: 90%;
                  height: 32px;
                  float: left;
                `}
                onChange={e => dispatch(updateJavaPath(e.target.value))}
                value={customJavaPath}
              />
              <StyledButtons
                color="primary"
                onClick={async () => {
                  const { filePaths, canceled } = await ipcRenderer.invoke(
                    'openFileDialog',
                    javaPath
                  );
                  if (!filePaths[0] || canceled) return;
                  dispatch(updateJavaPath(filePaths[0]));
                }}
              >
                <FontAwesomeIcon icon={faFolder} />
              </StyledButtons>
            </div>
          </div>
        </>
      )}
      <Hr />
      <SelectMemory>
        <Title
          css={`
            width: 100%;
            margin-top: 0px;
            height: 8px;
            text-align: left;
            margin-bottom: 20px;
          `}
        >
          Java Memory&nbsp; <FontAwesomeIcon icon={faMemory} />
        </Title>
        <Paragraph
          css={`
            width: 100%;
            text-align: left;
            margin: 0;
          `}
        >
          Select the preferred amount of memory to use when launching the game
        </Paragraph>
        <Slider
          css={`
            margin: 20px 20px 20px 0;
          `}
          onAfterChange={e => {
            dispatch(updateJavaMemory(e));
          }}
          defaultValue={javaMemory}
          min={1024}
          max={process.getSystemMemoryInfo().total / 1024}
          step={512}
          marks={marks}
          valueLabelDisplay="auto"
        />
      </SelectMemory>
      <Hr />
      <JavaCustomArguments>
        <Title
          css={`
            width: 100%;
            text-align: left;
          `}
        >
          Java Custom Arguments &nbsp; <FontAwesomeIcon icon={faList} />
        </Title>
        <Paragraph
          css={`
            text-align: left;
          `}
        >
          Select the preferred custom arguments to use when launching the game
        </Paragraph>
        <div
          css={`
            margin-top: 20px;
            width: 100%;
          `}
        >
          <Input
            onChange={e => dispatch(updateJavaArguments(e.target.value))}
            value={javaArgs}
            css={`
              width: 90%;
              height: 32px;
              float: left;
            `}
          />
          <StyledButtons
            onClick={() => resetJavaArguments(dispatch)}
            color="primary"
          >
            <FontAwesomeIcon icon={faUndo} />
          </StyledButtons>
        </div>
      </JavaCustomArguments>
    </JavaSettings>
  );
}
