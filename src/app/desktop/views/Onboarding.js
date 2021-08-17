import React, { useRef, useState, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltRight,
  faLongArrowAltLeft
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'antd';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { _getCurrentAccount } from '../../../common/utils/selectors';

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.palette.colors.darkBlue};
  overflow: hidden;
`;

const scrollToRef = ref =>
  ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

const Home = () => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [initScrolled, setInitScrolled] = useState(false);
  const account = useSelector(_getCurrentAccount);

  const firstSlideRef = useRef(null);
  const secondSlideRef = useRef(null);
  const thirdSlideRef = useRef(null);
  const fourthSlideRef = useRef(null);
  const executeScroll = type => {
    if (currentSlide + type < 0 || currentSlide + type > 5) return;
    setCurrentSlide(currentSlide + type);
    // eslint-disable-next-line default-case
    switch (currentSlide + type) {
      case 0:
        scrollToRef(firstSlideRef);
        break;
      case 1:
        scrollToRef(secondSlideRef);
        break;
      case 2:
        scrollToRef(thirdSlideRef);
        break;
      case 3:
        scrollToRef(fourthSlideRef);
        break;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setInitScrolled(true);
      executeScroll(1);
    }, 1200);
  }, []);

  return (
    <Background>
      <div
        ref={firstSlideRef}
        css={`
          height: 100%;
          width: 100%;
          background: ${props => props.theme.palette.grey[800]};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <div
          css={`
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            padding: 0 120px;
          `}
        >
          {account.selectedProfile.name}, welcome to Koala Launcher!
        </div>
      </div>
      <div
        ref={secondSlideRef}
        css={`
          height: 100%;
          width: 100%;
          background: ${props => props.theme.palette.grey[800]};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <div
          css={`
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            padding: 0 120px;
          `}
        >
          Koala Launcher is a GPL Licensed Open Source Minecraft Launcher which
          is transparent with its community.
        </div>
      </div>
      <div
        ref={thirdSlideRef}
        css={`
          height: 100%;
          width: 100%;
          background: ${props => props.theme.palette.grey[800]};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <div
          css={`
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            padding: 0 120px;
          `}
        >
          That is why we have a Discord server to talk to them all.
        </div>
        <Button
          css={`
            width: 200px;
            height: 40px;
            font-size: 20px;
            padding: 4px !important;
            margin-top: 20px;
          `}
          type="primary"
          href="https://invite.gg/KoalaDevs"
        >
          <FontAwesomeIcon icon={faDiscord} />
          &nbsp; Discord
        </Button>
      </div>
      <div
        ref={fourthSlideRef}
        css={`
          height: 100%;
          width: 100%;
          background: ${props => props.theme.palette.grey[800]};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <div
          css={`
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            padding: 0 120px;
          `}
        >
          Well that is it. Koala Launcher is all ready for you to enjoy. Game
          on!
        </div>
      </div>
      {currentSlide !== 0 && currentSlide !== 1 && initScrolled && (
        <div
          css={`
            position: fixed;
            left: 20px;
            bottom: 20px;
            transition: 0.1s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            font-size: 40px;
            cursor: pointer;
            width: 70px;
            height: 40px;
            color: ${props => props.theme.palette.text.icon};
            &:hover {
              background: ${props => props.theme.action.hover};
            }
          `}
          onClick={() => executeScroll(-1)}
        >
          <FontAwesomeIcon icon={faLongArrowAltLeft} />
        </div>
      )}
      {currentSlide !== 0 && initScrolled && (
        <div
          css={`
            position: fixed;
            right: 20px;
            bottom: 20px;
            transition: 0.1s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            font-size: 40px;
            cursor: pointer;
            width: 70px;
            height: 40px;
            color: ${props => props.theme.palette.text.icon};
            &:hover {
              background: ${props => props.theme.action.hover};
            }
          `}
          onClick={() => {
            if (currentSlide === 3) {
              dispatch(push('/home'));
            } else {
              executeScroll(1);
            }
          }}
        >
          <FontAwesomeIcon icon={faLongArrowAltRight} />
        </div>
      )}
    </Background>
  );
};

export default memo(Home);
