'use client';
import { useCallback, useState } from 'react';
import { Box } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';

import {
  styleWalletPaper,
  Wrapper,
  styledButton,
  BlockInfoStyled,
  InputWrapperStyled,
} from './page-styles';

interface IDataWallet {
  id: number;
  value?: string;
}

const dataWallet: IDataWallet[] = [
  { id: 1, value: undefined },
  { id: 2, value: undefined },
];

export default function SafeWallet() {
  const [walletData, setWalletData] = useState<IDataWallet[]>(dataWallet);

  const handleUseMetaMask = () => {};
  const handleAddRpc = () => {};

  const handleAddWallet = (elem: IDataWallet) => {
    console.log(elem);
  };

  const handleAddNewWallet = () => {
    const newWallet = {
      id: walletData.length + 1,
      value: undefined,
    };

    console.log('click');
    setWalletData(prevData => [...prevData, newWallet]);
  };

  const handleCreateWallet = () => {};

  const renderWallets = useCallback(
    () =>
      walletData.map((elem: IDataWallet) => (
        <InputWrapperStyled key={elem.id}>
          <Box width={'100%'}>
            <WalletInput
              label={`Wallet address ${elem.id}`}
              placeholder="Placeholder text"
              value={elem.value}
            />
          </Box>
          <WalletButton
            onClick={() => handleAddWallet(elem)}
            variant="contained"
            styles={styledButton}
          >
            Add Wallet
          </WalletButton>
        </InputWrapperStyled>
      )),
    [walletData]
  );

  return (
    <WalletLayout>
      <Wrapper>
        <WalletTypography fontSize={22} fontWeight={600}>
          Safe light Wallet
        </WalletTypography>
        <WalletPaper style={styleWalletPaper}>
          <BlockInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              Recipient address or ENS
            </WalletTypography>

            <InputWrapperStyled>
              <Box width={'100%'}>
                <WalletInput label="Label" placeholder="Placeholder text" />
              </Box>

              <WalletButton onClick={handleUseMetaMask} variant="outlined" styles={styledButton}>
                Use MetaMask RPC
              </WalletButton>
              <WalletButton onClick={handleAddRpc} variant="contained" styles={styledButton}>
                Add RPC
              </WalletButton>
            </InputWrapperStyled>
          </BlockInfoStyled>

          <BlockInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              If you have wallet - enter
            </WalletTypography>

            {renderWallets()}
          </BlockInfoStyled>
          <WalletButton onClick={handleAddNewWallet} variant="contained" styles={styledButton}>
            + Add new
          </WalletButton>
        </WalletPaper>

        <Box flexDirection={'column'}>
          <WalletTypography fontSize={12} fontWeight={600}>
            If you dont have wallet
          </WalletTypography>
          <WalletButton
            onClick={handleCreateWallet}
            variant="contained"
            styles={{ ...styledButton, marginTop: themeMuiBase.spacing(2) }}
          >
            Create wallet
          </WalletButton>
        </Box>
      </Wrapper>
    </WalletLayout>
  );
}
