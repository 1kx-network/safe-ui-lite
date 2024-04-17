import { useMemo } from 'react';
import type { AlertColor } from '@mui/material';
import type { Web3WalletTypes } from '@walletconnect/web3wallet';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import useChains from '@/hooks/useChains';
import { capitalize } from '@/utils/formatters';
import {
  getPeerName,
  isBlockedBridge,
  isWarnedBridge,
} from '@/features/walletconnect/services/utils';

const NAME_FALLBACK = 'this dApp';
const NAME_PLACEHOLDER = '%%name%%';
const CHAIN_PLACEHOLDER = '%%chain%%';

const Warnings: Record<string, { severity: AlertColor; message: string }> = {
  BLOCKED_BRIDGE: {
    severity: 'error',
    message: `${NAME_PLACEHOLDER} is a bridge that is incompatible with Safe{Wallet} — the bridged funds will be lost. Consider using a different bridge.`,
  },
  WARNED_BRIDGE: {
    severity: 'warning',
    message: `While bridging via ${NAME_PLACEHOLDER}, please make sure that the desination address you send funds to matches the Safe address you have on the respective chain. Otherwise, the funds will be lost.`,
  },
  UNSUPPORTED_CHAIN: {
    severity: 'error',
    message: `${NAME_PLACEHOLDER} does not support this Safe Account's network (${CHAIN_PLACEHOLDER}). Please switch to a Safe Account on one of the supported networks below.`,
  },
  WRONG_CHAIN: {
    severity: 'info',
    message: `Please make sure that the dApp is connected to ${CHAIN_PLACEHOLDER}.`,
  },
};

export const _getWarning = (origin: string, name: string, isUnsupportedChain: boolean) => {
  if (isUnsupportedChain) {
    return Warnings.UNSUPPORTED_CHAIN;
  }

  if (isBlockedBridge(origin)) {
    return Warnings.BLOCKED_BRIDGE;
  }

  if (isWarnedBridge(origin, name)) {
    return Warnings.WARNED_BRIDGE;
  }

  return Warnings.WRONG_CHAIN;
};

export const useCompatibilityWarning = (
  proposal: Web3WalletTypes.SessionProposal,
  isUnsupportedChain: boolean
): (typeof Warnings)[string] => {
  const { configs } = useChains();
  const { chainId } = useWeb3ModalAccount();

  return useMemo(() => {
    const name = getPeerName(proposal.params.proposer) || NAME_FALLBACK;
    const { origin } = proposal.verifyContext.verified;
    const warning = _getWarning(origin, name, isUnsupportedChain);
    const severity = warning.severity;
    let message = warning.message;

    if (message.includes(NAME_PLACEHOLDER)) {
      message = message.replaceAll(NAME_PLACEHOLDER, name);
      if (message.startsWith(NAME_FALLBACK)) {
        message = capitalize(message);
      }
    }

    if (message.includes(CHAIN_PLACEHOLDER)) {
      const chainName =
        configs.find(chain => chain.chainId === chainId?.toString())?.chainName ?? 'this network';
      message = message.replaceAll(CHAIN_PLACEHOLDER, chainName);
    }

    return {
      message,
      severity,
    };
  }, [configs, isUnsupportedChain, proposal.params, proposal.verifyContext.verified, chainId]);
};
