import { Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';

import ExternalLink from '@/common/ExternalLink';
import useLocalStorage from '@/features/local-storage/useLocalStorage';
import useSafeStore from '@/stores/safe-store';

const SAMPLE_DAPPS = [
  {
    name: 'Zerion',
    icon: '/images/common/nft-zerion.svg',
    url: 'https://app.zerion.io/connect-wallet',
  },
  { name: 'Zapper', icon: '/images/common/nft-zapper.svg', url: 'https://zapper.xyz/' },
  { name: 'OpenSea', icon: '/images/common/nft-opensea.svg', url: 'https://opensea.io/' },
];

const LS_KEY = 'native_wc_dapps';

const WcSampleDapps = ({ onUnload }: { onUnload: () => void }) => {
  // Only show the sample dApps list once
  useEffect(() => {
    return onUnload;
  }, [onUnload]);

  return (
    <Typography
      variant="body2"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      component="div"
    >
      {SAMPLE_DAPPS.map(item => (
        <Typography variant="body2" key={item.url}>
          <ExternalLink href={item.url} noIcon px={1}>
            <img
              src={item.icon}
              alt={item.name}
              width={32}
              height={32}
              style={{ marginRight: '0.5em' }}
            />
            {item.name}
          </ExternalLink>
        </Typography>
      ))}
    </Typography>
  );
};

const WcNoSessions = () => {
  const { safeSdk } = useSafeStore();
  const [showDapps = true, setShowDapps] = useLocalStorage<boolean>(LS_KEY);

  const onUnload = useCallback(() => {
    setShowDapps(false);
  }, [setShowDapps]);

  const sampleDapps = showDapps && safeSdk && <WcSampleDapps onUnload={onUnload} />;

  return (
    <>
      <Typography variant="body2" textAlign="center" color="text.secondary">
        No dApps are connected yet.{sampleDapps ? ' Try one of these:' : ''}
      </Typography>

      {sampleDapps}
    </>
  );
};

export default WcNoSessions;
