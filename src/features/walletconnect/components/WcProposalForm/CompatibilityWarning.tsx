import { Alert } from '@mui/material';
import type { Web3WalletTypes } from '@walletconnect/web3wallet';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import css from './styles.module.css';
import { useCompatibilityWarning } from './useCompatibilityWarning';

export const CompatibilityWarning = ({
  proposal,
  chainIds,
}: {
  proposal: Web3WalletTypes.SessionProposal;
  chainIds: Array<string>;
}) => {
  const { chainId } = useWeb3ModalAccount();
  const isUnsupportedChain = !chainIds.includes(chainId?.toString() ?? '1');
  const { severity, message } = useCompatibilityWarning(proposal, isUnsupportedChain);

  return (
    <>
      <Alert severity={severity} className={css.alert}>
        {message}
      </Alert>
    </>
  );
};
