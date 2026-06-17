import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('./AppClient'), { ssr: false });

export default function Home() {
  return <PortfolioApp />;
}
