'use client';

import {
  CenteringStyled,
  Switch,
  SwitchInput,
  Slider,
  SliderThumb,
  SwitchChecked,
  SliderThumbChecked,
} from './wallet-switch.styles';

interface IWalletSwitch {
  checked: boolean;
  onChange: () => void;
}

const WalletSwitch = ({ checked, onChange }: IWalletSwitch) => (
  <CenteringStyled onClick={onChange}>
    <Switch>
      <SwitchInput type="checkbox" checked={checked} />
      {checked ? (
        <SwitchChecked>
          <SliderThumbChecked />
        </SwitchChecked>
      ) : (
        <Slider>
          <SliderThumb />
        </Slider>
      )}
    </Switch>
  </CenteringStyled>
);

export default WalletSwitch;
