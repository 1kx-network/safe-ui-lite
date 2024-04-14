import React, { ReactNode, ReactElement } from 'react';
import { IconButton, SvgIcon } from '@mui/material';

import CopyIcon from '@/assets/svg/common/copy.svg';
import CopyTooltip from '../CopyTooltip';

export interface ButtonProps {
  text: string;
  className?: string;
  children?: ReactNode;
  initialToolTipText?: string;
  ariaLabel?: string;
  onCopy?: () => void;
  dialogContent?: ReactElement;
}

const CopyButton = ({
  text,
  className,
  children,
  initialToolTipText = 'Copy to clipboard',
  onCopy,
  dialogContent,
}: ButtonProps): ReactElement => {
  return (
    <CopyTooltip
      text={text}
      onCopy={onCopy}
      initialToolTipText={initialToolTipText}
      dialogContent={dialogContent}
    >
      {children ?? (
        <IconButton aria-label={initialToolTipText} size="small" className={className}>
          <SvgIcon
            data-testid="copy-btn-icon"
            component={CopyIcon}
            inheritViewBox
            fontSize="small"
          />
        </IconButton>
      )}
    </CopyTooltip>
  );
};

export default CopyButton;
