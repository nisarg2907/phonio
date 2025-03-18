import '@/styles/globals.css';

export const metadata = {
  title: 'Osmo Clone',
  description: 'A clone of Osmo Supply website with LiveKit integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
     
    </html>
  );
}