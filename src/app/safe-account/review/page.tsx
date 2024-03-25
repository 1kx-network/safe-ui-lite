'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';

import { useNetwork } from '@/hooks/useNetwork';
import { WalletTypography, WalletPaper, WalletLayout, WalletButton } from '@/ui-kit';
import { GridContainer, StepStyled, WrapperStyled, styleWalletPaper } from '../safe-account.styles';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import Accordion from '../components/accordion';
import { iconNetwork } from '@/utils/icon-formatter';
import IconDefualtAddress from '@/assets/svg/defult-icon-address.svg';
import { formattedLabel } from '@/utils/foramtters';
import { networks } from '@/context/networks';

import {
  CopyIconStyled,
  ItemInfoStyled,
  LinkOpenInNewIconStyled,
  OpenInNewIconStyled,
  OwnerListStyled,
} from './review.styles';

const owners = ['d'];

export default function CreatePageAccount() {
  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const network = useNetwork();
  const networkName = network?.name.toString();
  const chainId = Number(network?.chainId);

  useEffect(() => {
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
                  You are about to create a new Safe Account and will have to confirm the transaction
                  with your connected wallet
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
                      <IconDefualtAddress />

                      <WalletTypography fontSize={14}>
                        <WalletTypography fontSize={14} fontWeight={500}>
                          gno:
                        </WalletTypography>
                        {formattedLabel('sdfsdfowner.address')}
                      </WalletTypography>

                      <LinkOpenInNewIconStyled
                        href={`${linkOnScan}/address/{owner.address}`}
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
                  1 out of {owners.length} owner(s)
                </WalletTypography>
              </ItemInfoStyled>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} gap={3}>
              <WalletButton variant="outlined">Back</WalletButton>
              <WalletButton variant="contained">Create</WalletButton>
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
