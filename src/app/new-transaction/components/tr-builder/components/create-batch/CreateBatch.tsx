import { useRef } from 'react';
import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import useDropZone from '../../hooks/useDropZone';

import { StyledDragAndDropFileContainer, WrapperStyled } from './create-batch.styles';

type CreateNewBatchCardProps = {
  onFileSelected: (file: File | null) => void;
};

const CreateNewBatchCard = ({ onFileSelected }: CreateNewBatchCardProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { isOverDropZone, isAcceptError, dropHandlers } = useDropZone((file: File | null) => {
    onFileSelected(file);
  }, '.json');

  const handleFileSelected = (event: any) => {
    event.preventDefault();
    if (event.target.files.length) {
      onFileSelected(event.target.files[0]);
      event.target.value = '';
    }
  };

  const handleBrowse = function (event: any) {
    event.preventDefault();
    fileRef.current?.click();
  };

  return (
    <WrapperStyled>
      <StyledDragAndDropFileContainer
        {...dropHandlers}
        dragOver={isOverDropZone}
        error={isAcceptError}
      >
        {isAcceptError ? (
          <WalletTypography
            color={isAcceptError ? themeMuiBase.palette.error : themeMuiBase.palette.base}
          >
            The uploaded file is not a valid JSON file
          </WalletTypography>
        ) : (
          <>
            <Box onClick={handleBrowse}>
              <WalletTypography>
                Drag and drop a JSON file or{' '}
                <WalletTypography
                  color={themeMuiBase.palette.success}
                  style={{ cursor: 'pointer' }}
                >
                  choose a file
                </WalletTypography>
              </WalletTypography>
            </Box>
          </>
        )}
      </StyledDragAndDropFileContainer>
      <input
        ref={fileRef}
        id="logo-input"
        type="file"
        onChange={handleFileSelected}
        accept=".json"
        hidden
      />
    </WrapperStyled>
  );
};

export default CreateNewBatchCard;
