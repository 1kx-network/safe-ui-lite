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
import { styledHeader, styledPaper } from '../../wallet.styles';
import { options } from '../../fixtures';
import { CustomModal } from '@/components/modal';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { customToasty } from '@/components';
import { NATIVE_TOKENS, TOKENS_ERC20 } from '@/constants/tokens';
import { formatterIcon } from '@/utils/icon-formatter';
import useNetworkStore from '@/stores/networks-store';
import { IOptionNetwork } from '@/constants/networks';

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
  const router = useRouter();
  const { safeSdk } = useSafeStore();
  const { getInfoByAccount, getTokenERC20Balance } = useSafeSdk();
  const { address, chainId } = useWeb3ModalAccount();
  const { safeAddress, balanceAccount, setBalanceAccount, isLoading, setIsLoading } =
    useActiveSafeAddress();
  const { networks } = useNetworkStore();

  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [balanceAccountLocal, setBalanceAccountLocal] = useState(balanceAccount);
  const [isLoadingChain, setIsLoadingChain] = useState(false);

  const networkName =
    (networks && networks.find((elem: IOptionNetwork) => elem.chainId === chainId)?.currency) ?? '';

  const [value, setValue] = useState<string | null | undefined>('');

  useEffect(() => {
    setValue(networkName);
  }, [networkName]);

  useEffect(() => {
    setBalanceAccountLocal(balanceAccount);
  }, [balanceAccount]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeSelect = async (elem: SingleValue<any>) => {
    if (!elem || !chainId) return;
    const { label } = elem;

    if (label === NATIVE_TOKENS.ETH) {
      setIsLoading(true);
      const dataAcc = await getInfoByAccount(safeSdk);
      if (!dataAcc) return;

      const { balanceAccount } = dataAcc;
      const parceBalance = utils.formatEther(String(balanceAccount));

      setBalanceAccount(parceBalance);
      setBalanceAccountLocal(parceBalance);
    }

    if (label === TOKENS_ERC20[label]) {
      setIsLoading(true);
      const balanceERC20 = await getTokenERC20Balance(TOKENS_ERC20[label], chainId);
      const parceBalance = utils.formatUnits(String(balanceERC20), 6);

      setBalanceAccountLocal(parceBalance);
    }

    setIsLoading(false);
    setValue(elem.value);
  };

  const handleReceive = () => setIsOpenModal(true);
  const handleSend = () => router.push(routes.newTransactionSendToken);

  const handleCopyAddress = () => {
    if (safeAddress) {
      navigator.clipboard.writeText(safeAddress);
      customToasty('Address was copy', 'success');
    }
  };

  useEffect(() => {
    setIsLoadingChain(true);
    if (chainId && networks) {
      const network = networks.find(elem => elem.chainId === chainId);
      const linkOnScan = network && network.explorerUrl;

      network && setValue(network.currency);

      if (linkOnScan) {
        const updateLink = `${linkOnScan}/address/${safeAddress}`;
        setLinkOnScan(updateLink);
      }
    }

    setTimeout(() => setIsLoadingChain(false), 500);
  }, [chainId]);

  return (
    <>
      <WalletTypography style={styledHeader}>Overview</WalletTypography>
      <WalletPaper style={styledPaper}>
        <WalletTypography style={styledHeader}>Total asset value</WalletTypography>

        <TotalyBoxStyled>
          <WalletTypography style={styledHeader}>
            {balanceAccountLocal} {value}
          </WalletTypography>
          <Box width={'223px'}>
            <WalletSelect
              isLoading={isLoadingChain && isLoading}
              options={[
                {
                  id: 1,
                  value: networkName,
                  label: networkName,
                  icon: () => chainId && formatterIcon(chainId),
                },
                ...options,
              ]}
              defaultValue={{
                id: 0,
                value: networkName,
                label: networkName,
                icon: () => chainId && formatterIcon(chainId),
              }}
              onChange={handleChangeSelect}
            />
          </Box>
          {/* )} */}
        </TotalyBoxStyled>
        <WalletTypography fontSize={17} fontWeight={600}>
          {balanceAccountLocal} tokens
        </WalletTypography>
        <ButtonsGridStyled>
          <WalletButton
            onClick={handleSend}
            variant="contained"
            disabled={balanceAccountLocal === '0'}
            loading={isLoading}
          >
            Send
          </WalletButton>
          <WalletButton onClick={handleReceive} variant="outlined" disabled={!address || isLoading}>
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
