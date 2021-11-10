import { styled } from '@mui/material/styles';
import Button, {ButtonProps} from '@mui/material/Button';
import { theme } from "./Theme"

export const BiteButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
}));