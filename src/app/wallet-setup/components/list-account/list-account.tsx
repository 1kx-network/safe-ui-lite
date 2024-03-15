import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';
import { formattedLabel } from '@/utils/foramtters';
import { dataMock } from '../../fixutres';
import OpenIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconTrash from '@/assets/svg/trash.svg';

import { IconBox, ItemInfoStyled, ItemStyled, WalletListStyled } from './list-account.styles';

export const ListAccount = () => {
  return (
    <Box>
      <WalletTypography fontSize={17} fontWeight={600}>
        Name
        <WalletListStyled>
          {dataMock.map(elem => (
            <ItemStyled key={elem.id}>
              <ItemInfoStyled>
                <IconBox>+</IconBox>
                <WalletTypography fontSize={12} fontWeight={400}>
                  {formattedLabel(elem.address)}
                </WalletTypography>
                <OpenIcon width="14px" height="14px" />
                <CopyIcon width="14px" height="14px" />
              </ItemInfoStyled>
              <Box>
                <IconTrash />
              </Box>
            </ItemStyled>
          ))}
        </WalletListStyled>
      </WalletTypography>
    </Box>
  );
};
