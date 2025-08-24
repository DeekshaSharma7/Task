import "@/styles/globals.css"
export const metadata = {
  title: "Role-Based System",
  description: "User & Todo Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
