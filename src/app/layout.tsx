import React, { Suspense } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import WindowManager from '../components/WindowManager';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Nav />
        <WindowManager />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
