import { Button, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';

import { WCLoadingState } from '@/features/walletconnect/components/WalletConnectProvider';
import { isPairingUri } from '@/features/walletconnect/services/utils';
import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import useDebounce from '@/hooks/useDebounce';
import { asError } from '@/features/exceptions/utils';
import { getClipboard, isClipboardSupported } from '@/utils/clipboard';

const useTrackErrors = (error?: Error) => {
  const debouncedErrorMessage = useDebounce(error?.message, 1000);
  console.log(`[WcInput] Error: ${debouncedErrorMessage}`);
};

const WcInput = ({ uri }: { uri: string }) => {
  const { walletConnect, isLoading, setIsLoading } = useContext(WalletConnectContext);
  const [value, setValue] = useState('');
  const [error, setError] = useState<Error>();
  useTrackErrors(error);

  const onInput = useCallback(
    async (val: string) => {
      if (!walletConnect) return;

      setValue(val);

      if (val && !isPairingUri(val)) {
        setError(new Error('Invalid pairing code'));
        return;
      }

      if (!val) return;

      setIsLoading(WCLoadingState.CONNECT);

      try {
        await walletConnect.connect(val);
      } catch (e) {
        setError(asError(e));
      }

      setIsLoading(undefined);
    },
    [setIsLoading, walletConnect]
  );

  // Insert a pre-filled uri
  useEffect(() => {
    onInput(uri);
  }, [onInput, uri]);

  const onPaste = useCallback(async () => {
    // Errors are handled by in getClipboard
    const clipboard = await getClipboard();

    if (clipboard && isPairingUri(clipboard)) {
      onInput(clipboard);
    }
  }, [onInput]);

  return (
    <TextField
      value={value}
      onChange={e => onInput(e.target.value)}
      fullWidth
      autoComplete="off"
      autoFocus
      disabled={!!isLoading}
      error={!!error}
      label={error ? error.message : 'Pairing code'}
      placeholder="wc:"
      spellCheck={false}
      InputProps={{
        autoComplete: 'off',
        endAdornment: isClipboardSupported() ? undefined : (
          <InputAdornment position="end">
            <Button variant="contained" onClick={onPaste} sx={{ py: 1 }} disabled={!!isLoading}>
              {isLoading === WCLoadingState.CONNECT || isLoading === WCLoadingState.APPROVE ? (
                <CircularProgress size={20} />
              ) : (
                'Paste'
              )}
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default WcInput;
