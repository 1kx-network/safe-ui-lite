import { styled } from '@mui/system';

export const TransactionsSectionWrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  marign: 40px 0;
  gap: 6px;
`;

export const QuickTipWrapperStyled = styled('div')`
  margin-left: 35px;
  margin-top: 20px;
`;

export const UploadedLabelStyled = styled('span')`
  margin-left: 4px;
  color: #b2bbc0;
`;

export const FilenameLabelStyled = styled('div')`
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const styledNonce = {
  display: 'flex',
  alignItems: 'center',
  width: '75px',
  overflow: 'hidden',
};
