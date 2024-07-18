import { styled } from '@mui/system';
import CopyIcon from '@/assets/svg/copy.svg';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
`
);

export const ItemWrapperStyled = styled('div')<{ smallType?: boolean }>(
  ({ theme, smallType }) => `
    display: flex;
    width: 100%;
    aling-items: center;
    justify-content: ${smallType ? 'flex-start' : 'space-between'};
    gap: ${theme.spacing(2)};
    border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
    padding: ${theme.spacing(3)} 0; 

    &:last-child {
      border-bottom: 1px solid transparent;
    }
  `
);

export const ItemInfoStyled = styled('div')<{ isFirst?: boolean; smallType?: boolean }>(
  ({ theme, isFirst, smallType }) => `
  display: flex;
  align-items: center;
  justify-content: ${smallType ? 'flex-start' : !isFirst ? 'center' : 'flex-start'};
  width: ${smallType ? '67%' : '33%'};
  max-width: ${smallType ? '67%' : '33%'};
  min-width: 80px;
  overflow: hidder;
  gap: ${theme.spacing(1.5)};
  white-space: nowrap;
  text-overflow: ellipsis; 
`
);

export const IconCopyStyled = styled(CopyIcon)(
  ({ theme }) => `
     width: 14px;
     height: 14px;
     cursor: pointer;
     color: ${theme.palette.grey};
  `
);
