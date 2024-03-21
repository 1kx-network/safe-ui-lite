import React from 'react';
import Modal from 'react-modal';
import { WalletPaper, WalletTypography } from '@/ui-kit';
import IconClose from '@/assets/svg/close.svg';

import { customStyles, TitleStyled } from './modal.styles';
import { Box } from '@mui/system';

interface IModal {
  isOpen: boolean;
  children: React.ReactNode;
  //   openModal: () => void;
  closeModal: () => void;
  title: string;
  styles?: React.CSSProperties;
}

export const CustomModal = ({ isOpen, closeModal, children, title, styles }: IModal) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Modal"
      ariaHideApp={false}
    >
      <WalletPaper style={styles}>
        <TitleStyled>
          <WalletTypography fontSize={17} fontWeight={600}>
            {title}
          </WalletTypography>
          <Box onClick={closeModal}>
            <IconClose />
          </Box>
        </TitleStyled>
        {children}
      </WalletPaper>
    </Modal>
  );
};
