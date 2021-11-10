import { styled } from '@mui/material/styles';
import Slider, {SliderProps} from '@mui/material/Slider';
import { theme } from "./Theme"

export const BiteSlider = styled(Slider)<SliderProps>(() => ({
  color: theme.palette.primary.main,
}));
