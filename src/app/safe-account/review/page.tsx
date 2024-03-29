'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';

import { useNetwork } from '@/hooks/useNetwork';
import { WalletTypography, WalletPaper, WalletLayout, WalletButton } from '@/ui-kit';
import { GridContainer, StepStyled, WrapperStyled, styleWalletPaper } from '../safe-account.styles';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import Accordion from '../components/accordion';
import { iconNetwork } from '@/utils/icon-formatter';
import IconDefualtAddress from '@/assets/svg/defult-icon-address.svg';
import { formattedLabel } from '@/utils/foramtters';
import { networks } from '@/context/networks';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import routes from '@/app/routes';
import useActiveOwnerStore from '@/stores/active-owners-store';
import { customToasty } from '@/components';

import {
  CopyIconStyled,
  ItemInfoStyled,
  LinkOpenInNewIconStyled,
  OpenInNewIconStyled,
  OwnerListStyled,
} from './review.styles';

export default function CreatePageAccount() {
  const { owners, needConfirmOwner, setOwners, setNeedConfirmOwner } = useActiveOwnerStore();
  const network = useNetwork();
  const { deploySafe } = useSafeSdk();
  const router = useRouter();

  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const networkName = network?.name.toString();
  const chainId = Number(network?.chainId);

  useEffect(() => {
    if (!owners.length) {
      router.push(routes.safeAccountOwners);
      return;
    }

    if (chainId) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }
    }
  }, [chainId]);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const handleCreate = async () => {
    setIsLoading(true);

    await deploySafe(owners, needConfirmOwner)
      .then(res => {
        if (!!res) {
          customToasty('Account successfully created', 'success');
          router.push(routes.walletPage);
        }
      })
      .catch(() => customToasty('Something error with create account', 'error'))
      .finally(() => setIsLoading(false));
  };

  const handleClickBack = () => {
    setOwners([]);
    setNeedConfirmOwner(1);
    router.push(routes.safeAccountOwners);
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled style={{ height: 'fit-content' }}>
        <WalletTypography className="safe-account_main-header" fontSize={18} fontWeight={600}>
          Create Safe Account
        </WalletTypography>
        <GridContainer>
          <WalletPaper style={styleWalletPaper} minWidth="653px">
            <Box display="flex" alignItems="center" mb={1.6}>
              <StepStyled>
                <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                  3
                </WalletTypography>
              </StepStyled>
              <Box>
                <WalletTypography component="h2" fontSize={18} fontWeight={600}>
                  Review
                </WalletTypography>
                <WalletTypography
                  fontSize={12}
                  fontWeight={400}
                  color={themeMuiBase.palette.tetriaryGrey}
                >
                  You are about to create a new Safe Account and will have to confirm the
                  transaction with your connected wallet
                </WalletTypography>
              </Box>
            </Box>

            <Box mb={6}>
              <ItemInfoStyled>
                <WalletTypography component="p" fontSize={14} fontWeight={500}>
                  Network
                </WalletTypography>

                <Box display={'flex'} alignItems={'center'} gap={themeMuiBase.spacing(2)}>
                  {chainId ? iconNetwork(chainId) : ``}
                  <WalletTypography fontSize={14} fontWeight={600} textTransform="capitalize">
                    {networkName}
                  </WalletTypography>
                </Box>
              </ItemInfoStyled>
              <ItemInfoStyled>
                <WalletTypography component="p" fontSize={14} fontWeight={500}>
                  Name
                </WalletTypography>
                <WalletTypography component="p" fontSize={14} fontWeight={500}>
                  {networkName}
                </WalletTypography>
              </ItemInfoStyled>
              <ItemInfoStyled>
                <WalletTypography component="p" fontSize={14} fontWeight={500}>
                  Owner{owners.length > 1 ? 's' : ''}
                </WalletTypography>

                <OwnerListStyled>
                  {owners.map((owner, index) => (
                    <Box display={'flex'} gap={1.5} key={index}>
                      <IconDefualtAddress width={'16px'} height={'16px'} />

                      <WalletTypography fontSize={14}>
                        <WalletTypography fontSize={14} fontWeight={500}>
                          gno:
                        </WalletTypography>
                        {formattedLabel(owner)}
                      </WalletTypography>

                      <LinkOpenInNewIconStyled
                        href={`${linkOnScan}address/${owner}`}
                        target="_blank"
                      >
                        <OpenInNewIconStyled />
                      </LinkOpenInNewIconStyled>
                      <CopyIconStyled onClick={() => handleCopyAddress('owner.address')} />
                    </Box>
                  ))}
                </OwnerListStyled>
              </ItemInfoStyled>
              <ItemInfoStyled>
                <WalletTypography component="p" fontSize={14} fontWeight={500}>
                  Threshold
                </WalletTypography>
                <WalletTypography component="p" fontSize={14} fontWeight={500}>
                  {needConfirmOwner} out of {owners.length} owner(s)
                </WalletTypography>
              </ItemInfoStyled>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} gap={3}>
              <WalletButton variant="outlined" disabled={isLoading} onClick={handleClickBack}>
                Back
              </WalletButton>
              <WalletButton variant="contained" onClick={handleCreate} loading={isLoading}>
                Create
              </WalletButton>
            </Box>
          </WalletPaper>

          <WalletPaper style={{ ...styleWalletPaper, gap: themeMuiBase.spacing(3) }}>
            <Box mb={3}>
              <WalletTypography fontSize={18} fontWeight={600}>
                Safe account creation
              </WalletTypography>
            </Box>
            <Accordion
              title="Flat hierarchy"
              description="Every signer has the same rights within the Safe Account and can propose, sign and execute transactions that have the required confirmations."
            />
            <Accordion
              title="Managing Signers"
              description="You can always change the number of signers and required confirmations in your Safe Account after creation."
            />
          </WalletPaper>
        </GridContainer>
      </WrapperStyled>
    </WalletLayout>
  );
}
