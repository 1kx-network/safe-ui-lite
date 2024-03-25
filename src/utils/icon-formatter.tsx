import React from 'react';

import BNBIcon from '@/assets/svg/BNB.svg';
import GnosisIcon from '@/assets/svg/gnosis.svg';
import MaticIcon from '@/assets/svg/matic.svg';
import ETHIcon from '@/assets/svg/ETH.svg';

const iconMapping: { [key: number]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  '1': ETHIcon,
  '4': ETHIcon,
  '11155111': ETHIcon,
  '100': GnosisIcon,
  '10200': GnosisIcon,
  '56': BNBIcon,
  '97': BNBIcon,
  '137': MaticIcon,
  '250': ETHIcon,
};

export const iconNetwork = (
  chainId: number,
  width: string = '21px',
  height: string = '21px'
): React.ReactNode => {
  const IconComponent = iconMapping[chainId];
  if (IconComponent) {
    return <IconComponent width={width} height={height} />;
  } else {
    const IconComponent = iconMapping[1];
    return <IconComponent width={width} height={height} />;
  }
};
