import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] });

const baselGroteskBook = localFont({
  src: [
    {
      path: '../assets/fonts/Basel-Grotesk-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Basel-Grotesk-Book.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-basel-grotesk-book'
});

const baselGroteskMedium = localFont({
  src: [
    {
      path: '../assets/fonts/Basel-Grotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Basel-Grotesk-Medium.woff',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-basel-grotesk-medium'
});


export const fonts = {
  inter,
  baselGroteskBook,
  baselGroteskMedium
};