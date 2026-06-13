import { ReactNode } from 'react';

export const metadata = {
  title: 'Barcode Label Generator',
  description: 'Create and print thermal printer labels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
