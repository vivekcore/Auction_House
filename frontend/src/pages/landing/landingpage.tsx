import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { FlipWords } from "@/components/ui/flip-words";
import { useNavigate } from "react-router";

const features = [
  {
    title: "Real-time Bidding",
    description: "Experience live auctions with instant updates and real-time competition.",
    header: <div className="flex h-32 items-center justify-center bg-linear-to-br from-purple-900 to-indigo-900 rounded-xl" />,
  },
  {
    title: "Secure Transactions",
    description: "Every transaction is protected with bank-level encryption and verification.",
    header: <div className="flex h-32 items-center justify-center bg-linear-to-br from-emerald-900 to-teal-900 rounded-xl" />,
  },
  {
    title: "Global Reach",
    description: "Connect with buyers and sellers from around the world in seconds.",
    header: <div className="flex h-32 items-center justify-center bg-linear-to-br from-amber-900 to-orange-900 rounded-xl" />,
  },
  {
    title: "Instant Notifications",
    description: "Never miss a bid with instant alerts on your favorite auctions.",
    header: <div className="flex h-32 items-center justify-center bg-linear-to-br from-rose-900 to-pink-900 rounded-xl" />,
  },
  {
    title: "Expert Authentication",
    description: "Our team verifies every item ensuring authenticity and quality.",
    header: <div className="flex h-32 items-center justify-center bg-linear-to-br from-cyan-900 to-blue-900 rounded-xl" />,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your auction needs.",
    header: <div className="flex h-32 items-center justify-center bg-linear-to-br from-violet-900 to-purple-900 rounded-xl" />,
  },
];

const words = ["auctions", "deals", "treasures", "bids"];

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <BackgroundBeams />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">
            Welcome to <span className="text-purple-400">Auction</span> House
          </h1>
          
          <div className="text-xl md:text-3xl text-neutral-400 mb-8">
            Discover amazing{" "}
            <FlipWords words={words} className="text-white font-bold" />
            {" "}every day
          </div>
          
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-10">
            The premier marketplace for collectors and enthusiasts. 
            Buy and sell unique items with confidence through our secure platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/signin")}
              className="px-8 py-6 text-lg bg-white text-black hover:bg-neutral-200 transition-all"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => navigate("/signin")}
              variant="outline"
              className="px-8 py-6 text-lg border-neutral-700 text-white hover:bg-neutral-800"
            >
              Browse Auctions
            </Button>
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            Why Choose <span className="text-purple-400">Us</span>
          </h2>
          <p className="text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
            Experience the future of online auctions with cutting-edge features 
            designed for modern collectors.
          </p>
          
          <BentoGrid className="md:grid-cols-3">
            {features.map((feature, index) => (
              <BentoGridItem
                key={index}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                className="bg-neutral-900/50 border-neutral-800"
              />
            ))}
          </BentoGrid>
        </div>
      </div>

      <div className="py-20 px-4 bg-neutral-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start <span className="text-purple-400">Bidding</span>?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of collectors and enthusiasts. Sign up today and 
            discover your next treasure.
          </p>
          <Button 
            onClick={() => navigate("/signin")}
            className="px-10 py-7 text-xl bg-purple-600 hover:bg-purple-700 transition-all"
          >
            Create Free Account
          </Button>
        </div>
      </div>

      <footer className="py-8 px-4 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto text-center text-neutral-500">
          <p>© 2026 Auction House. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;