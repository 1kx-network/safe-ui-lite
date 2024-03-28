'use client';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import * as utils from 'ethers';
import { useRouter } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { Box } from '@mui/system';

import routes from '@/app/routes';
import useSafeStore from '@/stores/safe-store';
import { WalletButton, WalletPaper, WalletSelect, WalletTypography } from '@/ui-kit';
import { styledHeader, styledPaper } from '../../entry-page.styles';
import { IOptions, options } from '../../fixtures';
import { CustomModal } from '@/components/modal';
import { networks } from '@/context/networks';

import {
  TotalyBoxStyled,
  ButtonsGridStyled,
  customStyleModal,
  BoxOwnerLinkStyled,
  OwnerLinkStyled,
  CopyIconStyled,
  OpenInNewIconStyled,
  LinkOpenInNewIconStyled,
} from './overview.styles';

export const Overview = () => {
  const [value, setValue] = useState<SingleValue<IOptions> | null>(options[0]);
  const [balanceAccount, setBalanceAccount] = useState('0');
  const router = useRouter();
  const { safeSdk } = useSafeStore();
  const { address, chainId } = useWeb3ModalAccount();

  const safeAddress = localStorage.getItem('safeAddress');

  useEffect(() => {
    if (safeSdk) {
      const pendingBalance = async () => {
        const balanceAccount = await safeSdk.getBalance();
        const parceBalance = utils.formatEther(String(balanceAccount));

        setBalanceAccount(parceBalance);
      };

      pendingBalance();
    }
  }, [safeSdk]);

  // TODO type any
  // eslint-disable-next-line
  const handleChangeSelect = (elem: SingleValue<IOptions>) => {
    setValue(elem);
  };

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleReceive = () => setIsOpenModal(true);

  const handleSend = () => {
    router.push(routes.newTransaction);
  };

  const handleCopyAddress = () => {
    if (safeAddress) navigator.clipboard.writeText(safeAddress);
  };

  const [linkOnScan, setLinkOnScan] = useState<string>('');

  useEffect(() => {
    if (chainId) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        const updateLink = `${linkOnScan}/address/${safeAddress}`;
        setLinkOnScan(updateLink);
      }
    }
  }, [chainId]);

  return (
    <>
      <WalletTypography style={styledHeader}>Overview</WalletTypography>
      <WalletPaper style={styledPaper}>
        <WalletTypography style={styledHeader}>Total asset value</WalletTypography>

        <TotalyBoxStyled>
          <WalletTypography style={styledHeader}>
            {balanceAccount} {value?.label}
          </WalletTypography>
          <Box width={'223px'}>
            <WalletSelect
              options={options}
              defaultValue={options[0]}
              onChange={handleChangeSelect}
            />
          </Box>
        </TotalyBoxStyled>
        <WalletTypography fontSize={17} fontWeight={600}>
          {balanceAccount} tokens
        </WalletTypography>
        <ButtonsGridStyled>
          <WalletButton onClick={handleSend} variant="contained" disabled={balanceAccount === '0'}>
            Send
          </WalletButton>
          <WalletButton onClick={handleReceive} variant="outlined" disabled={!address}>
            Receive
          </WalletButton>
        </ButtonsGridStyled>
        <CustomModal
          title="Receive assets"
          isOpen={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          styles={customStyleModal}
        >
          <WalletTypography>
            This is the address of your Account. Deposit funds by copying the address below. Only
            send ETH and tokens (e.g. ERC20, ERC721) to this address.
          </WalletTypography>

          <BoxOwnerLinkStyled>
            <OwnerLinkStyled>
              <WalletTypography fontSize={17} fontWeight={400}>
                {safeAddress}
              </WalletTypography>
            </OwnerLinkStyled>
            <LinkOpenInNewIconStyled href={linkOnScan} target="_blank">
              <OpenInNewIconStyled />
            </LinkOpenInNewIconStyled>
            <CopyIconStyled onClick={handleCopyAddress} />
          </BoxOwnerLinkStyled>
        </CustomModal>
      </WalletPaper>
    </>
  );
};
