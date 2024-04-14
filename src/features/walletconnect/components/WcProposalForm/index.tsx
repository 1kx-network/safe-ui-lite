import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Typography,
} from '@mui/material';
import type { Web3WalletTypes } from '@walletconnect/web3wallet';
import {
  ChangeEvent,
  ReactElement,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import SafeAppIconCard from '@/components/safe-apps/SafeAppIconCard';
import { WCLoadingState } from '@/features/walletconnect/components/WalletConnectProvider';
import {
  getPeerName,
  getSupportedChainIds,
  isBlockedBridge,
  isWarnedBridge,
} from '@/features/walletconnect/services/utils';
import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import useChains from '@/hooks/useChains';
import { asError } from '@/features/exceptions/utils';
import useSafeStore from '@/stores/safe-store';

import { CompatibilityWarning } from './CompatibilityWarning';
import ProposalVerification from './ProposalVerification';
import css from './styles.module.css';

type ProposalFormProps = {
  proposal: Web3WalletTypes.SessionProposal;
  setProposal: Dispatch<SetStateAction<Web3WalletTypes.SessionProposal | undefined>>;
  onApprove: () => void;
};

const WcProposalForm = ({ proposal, setProposal, onApprove }: ProposalFormProps): ReactElement => {
  const { walletConnect, setError, setIsLoading, isLoading } = useContext(WalletConnectContext);

  const { configs } = useChains();
  const { safeSdk: safe } = useSafeStore();
  const { chainId } = useWeb3ModalAccount();
  const [understandsRisk, setUnderstandsRisk] = useState(false);
  const { proposer } = proposal.params;
  const { isScam, origin } = proposal.verifyContext.verified;
  const url = proposer.metadata.url || origin;

  const chainIds = useMemo(
    () => getSupportedChainIds(configs, proposal.params),
    [configs, proposal.params]
  );
  const isUnsupportedChain = !chainIds.includes(chainId?.toString() ?? '1');

  const name = getPeerName(proposer) || 'Unknown dApp';
  const isHighRisk =
    proposal.verifyContext.verified.validation === 'INVALID' || isWarnedBridge(origin, name);
  const isBlocked = isScam || isBlockedBridge(origin);
  const disabled =
    !safe || isUnsupportedChain || isBlocked || (isHighRisk && !understandsRisk) || !!isLoading;

  // On session reject
  const onReject = useCallback(async () => {
    if (!walletConnect || !proposal) return;

    setIsLoading(WCLoadingState.REJECT);

    try {
      await walletConnect.rejectSession(proposal);
    } catch (e) {
      setIsLoading(undefined);
      setError(asError(e));
    }

    setIsLoading(undefined);
    setProposal(undefined);
  }, [walletConnect, proposal, setIsLoading, setProposal, setError]);

  const onCheckboxClick = useCallback(
    (_: ChangeEvent, checked: boolean) => {
      setUnderstandsRisk(checked);
    },
    [url]
  );

  return (
    <div className={css.container}>
      <Typography variant="body2" color="text.secondary">
        WalletConnect
      </Typography>

      {proposer.metadata.icons[0] && (
        <div className={css.icon}>
          <SafeAppIconCard
            src={proposer.metadata.icons[0]}
            width={32}
            height={32}
            alt={`${name || 'dApp'} logo`}
          />
        </div>
      )}

      <Typography mb={1}>
        <b>{name}</b> wants to connect
      </Typography>

      <Typography className={css.origin} mb={3}>
        {proposal.verifyContext.verified.origin}
      </Typography>

      <div className={css.info}>
        <ProposalVerification proposal={proposal} />

        <CompatibilityWarning proposal={proposal} chainIds={chainIds} />
      </div>

      {!isBlocked && isHighRisk && (
        <FormControlLabel
          className={css.checkbox}
          control={<Checkbox checked={understandsRisk} onChange={onCheckboxClick} />}
          label="I understand the risks associated with interacting with this dApp and would like to continue."
        />
      )}

      <Divider flexItem className={css.divider} />

      <div className={css.buttons}>
        <Button variant="outlined" onClick={onReject} className={css.button} disabled={!!isLoading}>
          {isLoading === WCLoadingState.REJECT ? <CircularProgress size={20} /> : 'Reject'}
        </Button>

        <Button
          variant="contained"
          onClick={() => onApprove()}
          className={css.button}
          disabled={disabled}
        >
          {isLoading === WCLoadingState.APPROVE ? <CircularProgress size={20} /> : 'Approve'}
        </Button>
      </div>
    </div>
  );
};

export default WcProposalForm;
