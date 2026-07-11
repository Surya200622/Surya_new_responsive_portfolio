import PortfolioApp from '@/App';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Surya CS',
};


export default function HomePage() {
  return <PortfolioApp />;
}
