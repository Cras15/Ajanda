import { keyframes } from '@emotion/react';
import { Check } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/joy';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from '../redux/snackbarSlice';

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const CustomSnackbar = () => {
  const { snackbar } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      variant="solid"
      //color="success"
      open={!!snackbar}
      onClose={() => dispatch(closeSnackbar())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<Check />}
      autoHideDuration={3000}
      {...snackbar}
      endDecorator={
        <Button
          onClick={() => dispatch(closeSnackbar())}
          size="sm"
          variant="solid"
          color={snackbar?.color}
        >
          OK
        </Button>
      }
      //sx={{ ml: 1 }}
      animationDuration={600}
      sx={{
        ml: 1,
        animation: snackbar?.open
          ? `${inAnimation} ${600}ms forwards`
          : `${outAnimation} ${600}ms forwards`,
      }}
    />
  )
}

export default CustomSnackbar