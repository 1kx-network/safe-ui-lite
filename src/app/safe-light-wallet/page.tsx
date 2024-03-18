'use client';
import { useState } from 'react';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';

import {
  styleWalletPaper,
  Wrapper,
  styledButton,
  BlockInfoStyled,
  InputWrapperStyled,
  styledCreateWallet,
} from './safe-wallet-page-styles';
import { WalletItem } from './components/wallet-item/wallet-Item';

interface IDataWallet {
  id: number;
  value?: string;
}

interface IInputsForm {
  rpc: string;
}

const dataWallet: IDataWallet[] = [
  { id: 1, value: undefined },
  { id: 2, value: undefined },
];

export default function SafeWallet() {
  const { handleSubmit, control } = useForm<IInputsForm>({
    mode: 'onSubmit',
  });

  const [walletData, setWalletData] = useState<IDataWallet[]>(dataWallet);

  const handleUseMetaMask = () => {};
  const handleAddRpc = () => {};

  const handleAddWallet = (elem: IDataWallet) => {
    console.log(elem);
  };

  const onSubmit: SubmitHandler<IInputsForm> = async (data: IInputsForm) => {
    console.log('_data_', data);
  };

  const handleAddNewWallet = () => {
    const newWallet = {
      id: walletData.length + 1,
      value: undefined,
    };

    setWalletData(prevData => [...prevData, newWallet]);
  };

  const handleRemoveWallet = (walletId: number) => {
    const updataWalletData = walletData.filter((wallet: IDataWallet) => wallet.id !== walletId);
    setWalletData(updataWalletData);
  };

  const handleCreateWallet = () => {};

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

            <form onSubmit={handleSubmit(onSubmit)}>
              <InputWrapperStyled>
                <Box width={'100%'}>
                  <Controller
                    control={control}
                    name="rpc"
                    render={({ field }) => (
                      <Box width={'100%'}>
                        <WalletInput {...field} label="Label" placeholder="Placeholder text" />
                      </Box>
                    )}
                  />
                </Box>

                <WalletButton onClick={handleUseMetaMask} variant="outlined" styles={styledButton}>
                  Use MetaMask RPC
                </WalletButton>
                <WalletButton onClick={handleAddRpc} variant="contained" styles={styledButton}>
                  Add RPC
                </WalletButton>
              </InputWrapperStyled>
            </form>
          </BlockInfoStyled>

          <BlockInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              If you have wallet - enter
            </WalletTypography>

            {walletData.map((elem: IDataWallet) => (
              <WalletItem
                key={elem.id}
                dataItem={elem}
                handleAddWallet={handleAddWallet}
                handleRemoveWallet={handleRemoveWallet}
              />
            ))}
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
            styles={styledCreateWallet}
          >
            Create wallet
          </WalletButton>
        </Box>
      </Wrapper>
    </WalletLayout>
  );
}
