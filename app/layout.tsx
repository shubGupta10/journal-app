import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Assuming global styles are imported here

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DayMark - The Shubham App', // Updated app title for browser tab
  description: 'A journaling and productivity application by Shubham.', // Update description if desired
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 
          If you have a global Header/Navbar component rendered here, 
          ensure it displays the new app name. 
          Example:
        */}
        {/* <Header appName="DayMark - The Shubham App" /> */}
        {children}
        {/* 
          If you have a global Footer component rendered here, 
          ensure it displays the new app name. 
          Example:
        */}
        {/* <Footer appName="DayMark - The Shubham App" /> */}
      </body>
    </html>
  );
}