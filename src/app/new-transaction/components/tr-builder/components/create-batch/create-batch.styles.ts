import { styled } from '@mui/system';

export const WrapperStyled = styled('div')``;

export const StyledDragAndDropFileContainer = styled('div')<{
  dragOver: boolean;
  error: boolean;
}>(
  ({ theme, error }) => `
  box-sizing: border-box;
  max-width: 100%;
  border: 1px dashed ${error ? theme.palette.error : 'rgba(122, 199, 240, 0.4)'};
  border-radius: 8px;
  background-color: ${error ? theme.palette.error : 'transparent'};
  padding: 24px;
  margin: 24px auto 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
`
);
