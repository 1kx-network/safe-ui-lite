import React from 'react';
import Modal from 'react-modal';
import { Box } from '@mui/system';

import { WalletPaper, WalletTypography } from '@/ui-kit';
import IconClose from '@/assets/svg/close.svg';

import { customStyles, TitleStyled, styledPaper } from './modal.styles';

interface IModal {
  isOpen: boolean;
  children: React.ReactNode;
  closeModal: () => void;
  title?: string;
  styles?: React.CSSProperties;
  // eslint-disable-next-line
  modalStyles?: any;
}

export const CustomModal = ({
  isOpen,
  closeModal,
  children,
  title,
  styles,
  modalStyles,
}: IModal) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{ ...customStyles, ...modalStyles }}
      contentLabel="Modal"
      ariaHideApp={false}
    >
      <WalletPaper style={{ ...styledPaper, ...styles }}>
        {title && (
          <TitleStyled>
            <WalletTypography fontSize={17} fontWeight={600}>
              {title}
            </WalletTypography>
            <Box onClick={closeModal} sx={{ cursor: 'pointer' }}>
              <IconClose />
            </Box>
          </TitleStyled>
        )}
        {children}
      </WalletPaper>
    </Modal>
  );
};
