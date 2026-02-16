import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export const metadata: Metadata = {
  title: 'OmniSales AI - Universal Sales Automation',
  description: 'Enterprise-grade multi-agent sales and marketing automation system.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNav />
            <main className="flex-1 overflow-y-auto bg-[#0F1419]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
