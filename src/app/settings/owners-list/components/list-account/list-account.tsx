import { Box } from '@mui/system';
import Link from 'next/link';

import { WalletTypography } from '@/ui-kit';
import { formattedLabel } from '@/utils/foramtters';
import OpenIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconTrash from '@/assets/svg/delete.svg';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import useActiveSafeAddress from '@/stores/safe-address-store';

import { ItemInfoStyled, ItemStyled, WalletListStyled } from './list-account.styles';

export const ListAccount = ({
  linkOnScan,
  handleRemoveOwnerAddress,
}: {
  linkOnScan: string;
  handleRemoveOwnerAddress: (address: string) => void;
}) => {
  const { safeAccountOwners } = useActiveSafeAddress();

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <Box>
      <WalletTypography fontSize={17} fontWeight={600}>
        Name
        <WalletListStyled>
          {safeAccountOwners.map((address, index) => (
            <ItemStyled key={index}>
              <ItemInfoStyled>
                <IconDefaultAddress width="33px" height="33px" />
                <WalletTypography fontSize={12} fontWeight={400}>
                  {formattedLabel(address, 9, 9)}
                </WalletTypography>
                <Link href={`${linkOnScan}address/${address}`} target="_blank">
                  <OpenIcon width="18px" height="18px" />
                </Link>
                <CopyIcon width="18px" height="18px" onClick={() => handleCopyAddress(address)} />
              </ItemInfoStyled>
              {safeAccountOwners.length !== 1 && (
                <Box
                  sx={{ display: 'flex', cursor: 'pointer' }}
                  onClick={() => handleRemoveOwnerAddress(address)}
                >
                  <IconTrash />
                </Box>
              )}
            </ItemStyled>
          ))}
        </WalletListStyled>
      </WalletTypography>
    </Box>
  );
};
