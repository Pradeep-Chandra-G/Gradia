import Hero from "./components/Hero";
import PublicFooter from "./components/PublicFooter";
import PublicNavbar from "./components/PublicNavbar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className={`flex flex-col min-h-screen bg-white ${inter.className}`}>
      <PublicNavbar />

      <Hero />

      <PublicFooter />
    </main>
  );
}
