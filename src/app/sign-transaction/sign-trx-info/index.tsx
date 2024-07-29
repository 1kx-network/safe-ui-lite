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
import { formattedLabel } from '@/utils/formatters';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
import TrBuildComponent from '../tr-builder';

interface ISendTokenInfo {
  nonce: string | null;
  hash: string | null;
  amount: string | null;
  tokenType: string | null;
  linkOnScan: string | null;
  safeTransaction: null | SafeTransaction;
  address: string | null;
  typeSignTrx: keyof ITypeSignTrx | null;
  newThreshold: string | null;
  calldata: string | null;
  destinationName: string | null;
}

export const SignTransactionInfo = ({
  nonce,
  hash,
  linkOnScan,
  safeTransaction,
  address,
  typeSignTrx,
  newThreshold,
  amount,
  tokenType,
  calldata,
  destinationName,
}: ISendTokenInfo) => {
  const { REMOVE_OWNER, ADD_OWNER, ADD_MODULE, SEND_TOKEN, CHANGE_THRESHOLD, TR_BUILD } =
    TYPE_SIGN_TRX;

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
  const isAddModule = typeSignTrx === ADD_MODULE;

  return (
    <TransactionInfoStyled>
      <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
        Transaction Info
      </WalletTypography>
      {isAddModule && (
        <>
          <Box fontWeight={100} color="white">
            This transaction will enable add the zk module to the Safe.
          </Box>
        </>
      )}

      {isSendToken && (
        <>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Amount: {amount} {tokenType}
            </WalletTypography>
            {tokenType && formatterIcon(tokenType)}
          </Box>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            Nonce: {nonce}
          </WalletTypography>

          {/* Use name if address was choosed from address book */}
          {destinationName && (
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Name: {destinationName}
            </WalletTypography>
          )}

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

      {linkOnScan && hash && (
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            Hash:
          </WalletTypography>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            {formattedLabel(hash)}
          </WalletTypography>
          <Link
            href={`${linkOnScan}${linkOnScan.includes('buildbear') ? 'transaction' : 'tx'}/${hash}`}
            target="_blanck"
          >
            <OpenInNewIcon width="19px" height="18px" />
          </Link>
          <CopyIcon width="18px" height="19px" cursor="pointer" onClick={() => handleCopy(hash)} />
        </Box>
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
            {(calldata && shortenString(calldata as string)) ??
              formattedLabel(safeTransaction?.data.data ?? '0x')}
          </WalletTypography>
          <CopyIcon
            width="18px"
            height="19px"
            cursor="pointer"
            onClick={() => handleCopy(calldata ?? safeTransaction?.data.data ?? '0x')}
          />
        </Box>
      )}
    </TransactionInfoStyled>
  );
};

function shortenString(str: string) {
  if (!str) {
    return '';
  }
  // Check if the input is a valid string and long enough to be shortened
  if (str.length < 14) {
    return str;
  }
  // Extract the first 6 characters and the last 4 characters, and concatenate them with "...." in between
  return `${str.slice(0, 5)}....${str.slice(-5)}`;
}
