'use client';

import { WalletPaper } from '@/ui-kit';
import { ThemeProvider } from '@emotion/react';
import { themeMuiBase } from '../assets/theme-mui';
import { styled } from '@mui/system';

const Paper = styled(WalletPaper)`
  border-width: 1px 4px 4px 1px;
  width: 550px;
`;

const GridContainer = styled('div')`
  display: grid;
  gap: 15px;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr;

  @media (min-width: 1056px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default function CreatePageAccount() {
  return (
    <main style={{ background: '#D4D4D4', height: '100vh' }}>
      <ThemeProvider theme={themeMuiBase}>
        <GridContainer>
          <Paper>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, ipsum.</Paper>
          <Paper>
            <div>Your Safe Account preview</div>
            <div>
              <div>
                <p>Wallet</p>
                <p>0x98BB81Bda45af3Ef8FA0C1E636CCEb3085D2e443</p>
              </div>

              <div>
                <p>Network</p>
                <p>Polygon</p>
              </div>
            </div>
          </Paper>
        </GridContainer>
      </ThemeProvider>
    </main>
  );
}
