export const metadata = {
  title: "Connect Force",
  description: "Empowering Your Financial Horizon, One Transaction at a Time!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
