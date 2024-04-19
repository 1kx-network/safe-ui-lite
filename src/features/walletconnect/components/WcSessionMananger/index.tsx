import { useCallback, useContext, useEffect, useState } from 'react';
import type { Web3WalletTypes } from '@walletconnect/web3wallet';
import type { SessionTypes } from '@walletconnect/types';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { WCLoadingState } from '@/features/walletconnect/components/WalletConnectProvider';
import { asError } from '@/features/exceptions/utils';
import useLocalStorage from '@/features/local-storage/useLocalStorage';
import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import { WcConnectionForm } from '../WcConnectionForm';
import WcErrorMessage from '../WcErrorMessage';
import WcProposalForm from '../WcProposalForm';
import useActiveSafeAddress from '@/stores/safe-address-store';
import useWalletConnectSessions from '../../hooks/useWalletConnectSessions';

type WcSessionManagerProps = {
  sessions: SessionTypes.Struct[];
  uri: string;
};

// chainId -> origin -> boolean
type WcAutoApproveProps = Record<string, Record<string, boolean>>;

const WC_AUTO_APPROVE_KEY = 'wcAutoApprove';

const WcSessionManager = ({ sessions, uri }: WcSessionManagerProps) => {
  const [autoApprove = {}, setAutoApprove] =
    useLocalStorage<WcAutoApproveProps>(WC_AUTO_APPROVE_KEY);
  const { walletConnect, error, setError, open, setOpen, setIsLoading } =
    useContext(WalletConnectContext);
  const { chainId } = useWeb3ModalAccount();
  const { safeAddress } = useActiveSafeAddress();
  const [proposal, setProposal] = useState<Web3WalletTypes.SessionProposal>();
  const { updateSessions } = useWalletConnectSessions();

  // On session approve
  const onApprove = useCallback(
    async (proposalData?: Web3WalletTypes.SessionProposal) => {
      const sessionProposal = proposalData || proposal;

      if (!walletConnect || !chainId || !safeAddress || !sessionProposal) return;

      setIsLoading(WCLoadingState.APPROVE);

      try {
        await walletConnect.approveSession(sessionProposal, chainId.toString(), safeAddress);
        updateSessions();
        // Auto approve future sessions for non-malicious dApps
        if (
          sessionProposal.verifyContext.verified.validation !== 'INVALID' &&
          !sessionProposal.verifyContext.verified.isScam
        ) {
          setAutoApprove((prev: any) => ({
            ...prev,
            [chainId]: {
              ...prev?.[chainId],
              [sessionProposal.verifyContext.verified.origin]: true,
            },
          }));
        }

        setOpen(false);
      } catch (e) {
        setIsLoading(undefined);
        setError(asError(e));
        return;
      }

      setIsLoading(undefined);
      setProposal(undefined);
    },
    [
      proposal,
      updateSessions,
      walletConnect,
      chainId,
      safeAddress,
      setIsLoading,
      setOpen,
      setAutoApprove,
      setError,
    ]
  );

  // Reset error
  const onErrorReset = useCallback(() => {
    setError(null);
  }, [setError]);

  // Subscribe to session proposals
  useEffect(() => {
    if (!walletConnect) return;
    return walletConnect.onSessionPropose(proposalData => {
      setError(null);

      if (autoApprove[chainId?.toString() ?? '1']?.[proposalData.verifyContext.verified.origin]) {
        onApprove(proposalData);
        return;
      }

      setProposal(proposalData);
    });
  }, [walletConnect, setError, autoApprove, onApprove, chainId]);

  // Nothing to show
  if (!open) return null;

  // Error
  if (error) {
    return <WcErrorMessage error={error} onClose={onErrorReset} />;
  }

  // Session proposal
  if (proposal) {
    return <WcProposalForm proposal={proposal} setProposal={setProposal} onApprove={onApprove} />;
  }

  // Connection form (initial state)
  return <WcConnectionForm sessions={sessions} uri={uri} />;
};

export default WcSessionManager;
