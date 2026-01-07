import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";
import { getCategories } from "@/sanity/queries";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <>
      <Header categories={categories} />
      {children}
      <Footer />
    </>
  );
}
