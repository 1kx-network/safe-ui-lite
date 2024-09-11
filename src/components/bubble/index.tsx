import { Box } from '@mui/system';

export function Bubble(props: any) {
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(200px)',
        opacity: 0.4,
        height: '50%',
        width: '50%',
        background: '#0088FF',
        backgroundSize: '200% 100%',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate3d(0, 0, 0)',
        ...props,
      }}
    />
  );
}
