import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/system';
import { FaGithub, FaLinkedin, FaSquareXTwitter } from 'react-icons/fa6';

const textColor = 'rgba(255, 255, 255, 0.87)';

export function Footer() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.2)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box sx={{ flex: 1 }} /> {/* Spacer */}
      <Box
        color={textColor}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}
      >
        Built for the community by{' '}
        <Link
          href="https://1kx.capital"
          target="_blank"
          style={{ marginLeft: '1px', marginTop: '5px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1114.04 626.18"
            width="60"
            height="34"
          >
            <path
              fill={textColor}
              d="M421.4,308.48l90.92,103.58h-28.45l-79.18-90.59-31.39,23.08v67.51h-21.67V167.9h21.67v149.85l101.95-74.38h34.66l-88.5,65.1Zm-152.31-140.58h-16.54l-.48,1.05c-20.32,44.03-46.59,67.54-82.67,74l-1.49,.27v20.29l2.08-.32c32.52-4.97,61.95-21.37,77.01-42.49l-.23,173.3h-78.86v18.05h163.04v-18.05h-61.85V167.9Zm385.63,8.38l1.58-.7-2.9-7.54-1.67,.61c-75.41,27.55-130.15,102.51-130.15,178.24,0,44.96,22.14,86.26,59.23,110.46l1.4,.91,5.36-6.97-1.33-1.12c-25.48-21.41-40.7-58.92-40.7-100.34,0-75.14,43.87-144.89,109.17-173.57Zm180.73-7.44l-1.4-.91-5.36,6.97,1.33,1.12c25.48,21.4,40.7,58.91,40.7,100.34,0,75.14-43.87,144.89-109.17,173.57l-1.58,.7,2.9,7.54,1.67-.61c75.41-27.54,130.15-102.51,130.15-178.24,0-44.96-22.14-86.26-59.23-110.46Zm-177,219.98c-11.14,8.46-11.14-27.11-30.65-26.12-38.86,1.73-29.8,54.91,6.83,50.58,16.3-1.17,32.79-12.05,62.38-56.94l-4.73-12.49c-12.74,19.71-24.74,36.99-33.83,44.97Zm135.85-46.66l-9.8-4.59c-9.91,18.56-19.28,44.82-36.35,45.36-12.9,.4-15.99-19.86-22.19-33.76,0,0-1.56-4.13-4.03-10.66l-.06,.02s-30.36-79.11-32.32-82.68c-23.1-40.29-54.38,34.43-68.09,58.56l9.79,4.58c10.05-18.23,31.98-65.13,49-35.18,2.88,5.59,29.77,77.19,29.84,77.38,12.52,28.76,18.94,51.59,31.2,51.59,20.55,0,37.63-43.14,52.16-68.97l.83-1.66Zm-30.96-78.14c7.46-6.45,10.01-4.32,13.48,4.1,2.88,6.35,6.46,14.26,15.85,14.48,11.51,.47,21.91-9.58,20.62-21.21-1.41-14.34-13.41-21.9-28.01-20.17-17.45,1.53-33.2,11.99-65.56,62.05l4.79,12.62c16.85-26.71,28.5-42.28,38.83-51.87Zm-41.41,74.5c-3.3-8.73-.06,.02-.06,.02l.06-.02Z"
            />
          </svg>
        </Link>
      </Box>
      <Box
        id="footer-info"
        sx={{ color: 'white', display: 'flex', gap: 2, flex: 1, flexDirection: 'column' }}
      >
        <Box
          id="footer-icons"
          sx={{ color: 'white', display: 'flex', gap: 2, flex: 1, justifyContent: 'flex-end' }}
        >
          <Link
            href="https://github.com/1kx-network/zksafe"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            <FaGithub />
          </Link>
          <Link
            href="https://www.linkedin.com/company/1kxnetwork"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            <FaLinkedin />
          </Link>
          <Link
            href="https://x.com/1kxnetwork"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            <FaSquareXTwitter />
          </Link>
        </Box>
        <Box
          sx={{
            fontSize: 12,
            color: 'white',
            display: 'flex',
            gap: 2,
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Link
            href="https://github.com/1kx-network/zksafe?tab=Apache-2.0-1-ov-file#readme"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            License Info
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
