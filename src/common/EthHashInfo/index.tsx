import { type ReactElement } from 'react';

import SrcEthHashInfo, { type EthHashInfoProps } from './SrcEthHashInfo';

const EthHashInfo = ({
  avatarSize = 40,
  ...props
}: EthHashInfoProps & { showName?: boolean }): ReactElement => {
  return (
    <SrcEthHashInfo
      copyPrefix={false}
      {...props}
      customAvatar={props.customAvatar}
      avatarSize={avatarSize}
    >
      {props.children}
    </SrcEthHashInfo>
  );
};

export default EthHashInfo;
