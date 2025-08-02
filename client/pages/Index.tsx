import React from "react";
import OLXStyleHeader from "../components/OLXStyleHeader";
import OLXStyleCategories from "../components/OLXStyleCategories";
import OLXStyleListings from "../components/OLXStyleListings";
import PackagesShowcase from "../components/PackagesShowcase";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import PWAInstallButton from "../components/PWAInstallButton";
import BottomNavigation from "../components/BottomNavigation";
import HomepageBanner from "../components/HomepageBanner";
import Footer from "../components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <OLXStyleHeader />

      <main className="pb-16 bg-gradient-to-b from-red-50 to-white">
        {/* Hero Section with Red & White Theme */}
        <div className="bg-gradient-to-r from-[#C70000] to-red-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-6">
              Discover amazing properties in your area with verified listings
            </p>
          </div>
        </div>

        <OLXStyleCategories />

        {/* Mid-size banner below categories */}
        <div className="px-4 mb-6 bg-white py-6">
          <HomepageBanner position="homepage_middle" />
        </div>

        <div className="bg-white">
          <OLXStyleListings />
        </div>

        <div className="bg-red-50 py-8">
          <PackagesShowcase />
        </div>
      </main>

      <BottomNavigation />
      <PWAInstallPrompt />
      <PWAInstallButton />
      <Footer />
    </div>
  );
}
