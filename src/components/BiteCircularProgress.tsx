import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { theme } from "./Theme"

export const BiteCircularProgress = styled(CircularProgress)(() => ({
  color: theme.palette.primary.main,
}));