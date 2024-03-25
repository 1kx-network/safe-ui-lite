import { styled } from '@mui/system';

export const OwnerStylesBtn = {
  fontSize: '13px',
  fontWeight: 500,
  width: '150px',
  paddingRight: 0,
  gap: '4px',
};

export const OwnersListStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    max-height: 320px;
    overflow: scroll;
    gap: ${theme.spacing(3)};
`
);

export const RemoveAddressStyled = styled('div')`
  cursor: pointer;
  display: flex;
  height: 2.688rem;
  align-items: center;
`;

export const GridOwnerAddressStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(3.5)};
  justify-content: space-between;

  @media (max-width: 1068px) {
    flex-wrap: wrap;
}
`
);

export const BoxAddressStyled = styled('div')(
  ({ theme }) => `
  width: 65%;
  display: flex;
  align-items: end;
  gap: ${theme.spacing(2)};

  @media (max-width: 1068px) {
    width: 100%;
  }
`
);

export const BoxNameStyled = styled('div')`
  width: 35%;
  display: flex;
  align-items: end;

  @media (max-width: 1068px) {
    width: 100%;
  }
`;
