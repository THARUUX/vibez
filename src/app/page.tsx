import { Hero, FeaturedProducts } from "@/components/home/HomeContent";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedProducts />
    </div>
  );
}
