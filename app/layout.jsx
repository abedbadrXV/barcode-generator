export const metadata = {
  title: 'Barcode Label Generator',
  description: 'Create and print thermal printer labels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
