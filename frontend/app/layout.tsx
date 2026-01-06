import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Civic Ledger',
  description: 'Transparent, immutable journalism on the blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
        <footer className="py-6 border-t border-stone-200 text-center text-sm text-stone-500 font-serif italic">
          &copy; {new Date().getFullYear()} Civic Ledger. Immutable Journalism.
        </footer>
      </body>
    </html>
  );
}
