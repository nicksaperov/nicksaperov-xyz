import './globals.css';

export const metadata = {
  title: 'Nick Saperov | Systems Architecture',
  description: 'Enterprise Cloud & Web3 Product Manager',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-gray-200 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
