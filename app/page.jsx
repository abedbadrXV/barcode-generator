import dynamic from 'next/dynamic';

const BarcodeApp = dynamic(() => import('./barcode-client'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#fafaf9', padding: '20px' }}></div>,
});

export default function Home() {
  return <BarcodeApp />;
}
