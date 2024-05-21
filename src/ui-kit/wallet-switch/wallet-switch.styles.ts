import { styled } from '@mui/system';

export const CenteringStyled = styled('div')`
  width: 41px;
  height: 21px;
  text-align: center;
`;

export const Switch = styled('div')`
  position: relative;
  display: inline-block;
  width: 41px;
  height: 21px;
`;

export const SwitchInput = styled('input')`
  display: none;
`;

export const Slider = styled('div')`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #dedede;
  border-radius: 20px;
  transition: 0.4s;
`;

export const SliderThumb = styled('div')`
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  background: #fff;
  border-radius: 50%;
  left: 3px;
  bottom: 2.5px;
  transition: 0.4s;
`;

export const SwitchChecked = styled(Slider)`
  background: #43c057;
`;

export const SliderThumbChecked = styled(SliderThumb)`
  transform: translateX(30px);
  left: -8px;
`;
