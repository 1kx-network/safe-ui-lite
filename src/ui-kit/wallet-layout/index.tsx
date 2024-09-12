import * as React from 'react';
import { Box } from '@mui/system';

import { Sidebar, UserInfoBar } from '@/components';
import Loading from '@/assets/svg/loader.svg';
import { Bubble } from '@/components/bubble';
import { Footer } from '../../components/footer/footer';

import { LayoutStyled, InfoUserStyled } from './wallet-layout.styles';

interface IWalletLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function WalletLayout({ children, hideSidebar }: IWalletLayoutProps) {
  return (
    <LayoutStyled>
      <Bubble top={0} left={0} />
      <Bubble right={-10} bottom={0} opacity={0.25} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          padding: '0 20px 40px 20px',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        {!hideSidebar && <Sidebar />}

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
          {!hideSidebar && (
            <InfoUserStyled>
              <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>ZKSafe</Box>
              <UserInfoBar />
            </InfoUserStyled>
          )}

          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <React.Suspense
              fallback={
                <Box sx={{ height: '200px', width: '200px', margin: 'auto' }}>
                  <Loading />
                </Box>
              }
            >
              {children}
            </React.Suspense>
          </Box>
        </Box>
      </Box>
      <Footer />
    </LayoutStyled>
  );
}
