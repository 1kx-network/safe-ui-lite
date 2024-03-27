'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useDisconnect, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';

import { useNetwork } from '@/hooks/useNetwork';
import routes from '@/app/routes';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import {
  WalletTypography,
  WalletPaper,
  WalletLayout,
  WalletButton,
  WalletInput,
  WalletSelect,
} from '@/ui-kit';
import {
  GridButtonStyled,
  GridContainer,
  StepStyled,
  WrapperStyled,
  styleWalletPaper,
} from '../safe-account.styles';
import { optionsNetwork } from '../constants';
import ETHIcon from '@/assets/svg/eth-icon.svg';
import { AccountInfo } from '../components/account-info/account-info';

interface IOption {
  chainId: number;
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function CreatePageAccount() {
  const [options, setOptions] = useState<IOption[]>(optionsNetwork);
  const [chooseOpt, setChooseOpt] = useState(optionsNetwork[0]);
  const [valueAcc, setValueAcc] = useState('');

  const router = useRouter();
  const { address } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const network = useNetwork();

  const networkName = network?.name.toString();
  const chainId = Number(network?.chainId);

  useEffect(() => {
    if (chainId) {
      const updatedOption = optionsNetwork.find(option => option.chainId === +chainId);
      if (updatedOption) {
        setChooseOpt(updatedOption);
      } else if (chainId && networkName) {
        const newOption: IOption = {
          chainId: +chainId,
          label: networkName,
          value: networkName,
          icon: ETHIcon,
        };
        setOptions(prevOptions => [...prevOptions, newOption]);
        setChooseOpt(newOption);
      }
    }
  }, [chainId]);

  const handleClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    disconnect();
    router.push(routes.home);
  };

  const handleNext = () => {
    router.push(routes.safeAccountOwners);
  };

  const handleChooseNetwork = async (network: number) => {
    console.log(network, chainId);
  };

  const handleSetValueAcc = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueAcc(value);
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled style={{ height: 'fit-content' }}>
        <WalletTypography className="safe-account_main-header" fontSize={22} fontWeight={600}>
          Create new Safe Account
        </WalletTypography>

        <GridContainer>
          <WalletPaper style={styleWalletPaper} minWidth="653px">
            <Box display="flex" alignItems="center">
              <StepStyled>
                <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                  1
                </WalletTypography>
              </StepStyled>
              <WalletTypography component="h2" fontSize={18} fontWeight={600}>
                Select network and name of your Safe Account
              </WalletTypography>
            </Box>

            <Box display="flex" gap={themeMuiBase.spacing(3)}>
              <WalletInput
                label="Name"
                placeholder="Enter name"
                value={valueAcc}
                onChange={handleSetValueAcc}
              />

              <Box minWidth={'177px'} display={'flex'} alignItems={'end'}>
                <WalletSelect
                  options={options}
                  defaultValue={chooseOpt}
                  onChange={(newValue: IOption | null | undefined) =>
                    newValue && handleChooseNetwork(newValue.chainId)
                  }
                />
              </Box>
            </Box>

            <Box mt={3}>
              <WalletTypography fontWeight={500} fontSize={14}>
                By continuing, you agree to our terms of use and privacy policy.
              </WalletTypography>
            </Box>

            <GridButtonStyled>
              <WalletButton onClick={handleClickCancel} variant="outlined">
                Cancel
              </WalletButton>
              <WalletButton onClick={handleNext} variant="contained">
                Next
              </WalletButton>
            </GridButtonStyled>
          </WalletPaper>

          {/* --- */}
          <AccountInfo account={address} networkName={networkName} chainId={chainId} />
        </GridContainer>
      </WrapperStyled>
      {/*  */}
    </WalletLayout>
  );
}
