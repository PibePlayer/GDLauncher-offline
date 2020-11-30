import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useKey } from 'rooks';
import CloseButton from './CloseButton';
import { closeModal } from '../reducers/modals/actions';

const HeaderComponent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  height: 40px;
  background: ${props => props.theme.palette.grey[800]};
  border-radius: 4px;
  h3 {
    line-height: 40px;
    margin: 0;
  }
`;

const Container = styled.div`
  background: ${props =>
    props.transparentBackground
      ? 'transparent'
      : props.theme.palette.grey[700]};
  position: absolute;
  border-radius: 4px;
`;

const ModalWindow = ({
  transparentBackground,
  header,
  title,
  backBtnFn,
  children,
  className,
  removePadding
}) => {
  const dispatch = useDispatch();

  useKey(['Escape'], () => dispatch(closeModal()));

  return (
    <Container
      transparentBackground={transparentBackground}
      className={className}
    >
      {(header === undefined || header === true) && (
        <HeaderComponent>
          <h3>{title || 'Modal'}</h3>
          <CloseButton onClick={() => dispatch(closeModal())} />
        </HeaderComponent>
      )}
      <div
        header={header}
        removePadding={removePadding}
        css={`
          height: ${header === undefined || header === true
            ? 'calc(100% - 40px)'
            : '100%'};
          width: 100%;
          padding: ${props =>
            (props.header === undefined || props.header === true) &&
            !props.removePadding
              ? 20
              : 0}px;
          overflow-y: hidden;
          overflow-x: hidden;
          position: relative;
        `}
      >
        {backBtnFn !== undefined && backBtnFn(() => dispatch(closeModal()))}
        {children}
      </div>
    </Container>
  );
};

export default memo(ModalWindow);
