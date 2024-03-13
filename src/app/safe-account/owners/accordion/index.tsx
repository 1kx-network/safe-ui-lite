import * as React from 'react';
import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';

import { AccordionStyled, ArrowDownStyled, ArrowUpStyled } from './accordion.styles';

interface IAccordionProps {
  title: string;
  description: string;
  initialOpen?: boolean;
}

const Accordion = ({ title, description, initialOpen = false }: IAccordionProps) => {
  const [open, setOpen] = React.useState(initialOpen);
  return (
    <AccordionStyled>
      <Box justifyContent="space-between" display="flex" alignItems="center">
        <WalletTypography fontWeight={600} component="p">
          {title}
        </WalletTypography>
        {open ? (
          <ArrowUpStyled onClick={() => setOpen(!open)} />
        ) : (
          <ArrowDownStyled onClick={() => setOpen(!open)} />
        )}
      </Box>
      {open && (
        <Box mt={3}>
          <WalletTypography>{description}</WalletTypography>
        </Box>
      )}
    </AccordionStyled>
  );
};

export default Accordion;
