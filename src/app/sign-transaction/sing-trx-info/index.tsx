import Link from 'next/link';
import { Box } from '@mui/system';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';

import { WalletTypography } from '@/ui-kit';
import { TransactionInfoStyled } from '../sing-transaction.styles';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { formatterIcon } from '@/utils/icon-formatter';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import { customToasty } from '@/components';
import { formattedLabel } from '@/utils/foramtters';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
import TrBuildComponent from '../tr-builder';

interface ISendTokenInfo {
  amount: string | null;
  tokenType: string | null;
  linkOnScan: string | null;
  safeTransaction: null | SafeTransaction;
  address: string | null;
  typeSignTrx: keyof ITypeSignTrx | null;
  newThreshold: string | null;
}

export const SignTransactionInfo = ({
  linkOnScan,
  safeTransaction,
  address,
  typeSignTrx,
  newThreshold,
  amount,
  tokenType,
}: ISendTokenInfo) => {
  const { REMOVE_OWNER, ADD_OWNER, SEND_TOKEN, CHANGE_THRESHOLD, TR_BUILD } = TYPE_SIGN_TRX;

  const handleCopy = (address: string | null) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    customToasty('Was copy', 'success');
  };

  const isSendToken = typeSignTrx === SEND_TOKEN;
  const isTresholder = typeSignTrx === CHANGE_THRESHOLD;
  const isChangeOwner = typeSignTrx === ADD_OWNER || typeSignTrx === REMOVE_OWNER;
  const isAddOwner = typeSignTrx === ADD_OWNER;
  const isTrBuild = typeSignTrx === TR_BUILD;

  return (
    <TransactionInfoStyled>
      <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
        Transaction Info
      </WalletTypography>

      {isSendToken && (
        <>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Amount: {amount} {tokenType}
            </WalletTypography>
            {tokenType && formatterIcon(tokenType)}
          </Box>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Destination:{' '}
            </WalletTypography>
            <IconDefaultAddress width="21px" height="21px" />
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              {address}
            </WalletTypography>
            <Link href={`${linkOnScan}address/${address}`} target="_blanck">
              <OpenInNewIcon width="19px" height="18px" />
            </Link>
            <CopyIcon
              width="18px"
              height="19px"
              cursor="pointer"
              onClick={() => handleCopy(address)}
            />
          </Box>
        </>
      )}

      {isTresholder && (
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            Change threshold on
          </WalletTypography>
          <WalletTypography fontWeight={600} color={themeMuiBase.palette.white}>
            {newThreshold}
          </WalletTypography>
        </Box>
      )}

      {isChangeOwner && (
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            {isAddOwner ? 'Add new owner:' : 'Remove owner:'}{' '}
          </WalletTypography>
          <IconDefaultAddress width="21px" height="21px" />
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            {address}
          </WalletTypography>
          <Link href={`${linkOnScan}address/${address}`} target="_blanck">
            <OpenInNewIcon width="19px" height="18px" />
          </Link>
          <CopyIcon
            width="18px"
            height="19px"
            cursor="pointer"
            onClick={() => handleCopy(address)}
          />
        </Box>
      )}

      {isTrBuild && <TrBuildComponent />}

      {safeTransaction?.data.data && (
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            Calldata:{' '}
          </WalletTypography>
          <IconDefaultAddress width="21px" height="21px" />
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            {formattedLabel(safeTransaction?.data.data ?? '0x')}
          </WalletTypography>
        </Box>
      )}
    </TransactionInfoStyled>
  );
};
