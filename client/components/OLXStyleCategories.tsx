import React, { useState, useEffect } from "react";
import {
  Car,
  Building2,
  Smartphone,
  Briefcase,
  Shirt,
  Bike,
  Tv,
  Truck,
  Sofa,
  Heart,
  Plus,
} from "lucide-react";
import { withApiErrorBoundary } from "./ApiErrorBoundary";

const categoryIcons: Record<string, any> = {
  "Cars": Car,
  "Properties": Building2,
  "Mobiles": Smartphone,
  "Jobs": Briefcase,
  "Fashion": Shirt,
  "Bikes": Bike,
  "Electronics & Appliances": Tv,
  "Commercial Vehicles & Spares": Truck,
  "Furniture": Sofa,
  "Pets": Heart,
};

interface Category {
  _id?: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: any[];
  order: number;
  active: boolean;
}

interface HomepageSlider {
  _id: string;
  title: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  order: number;
}

function OLXStyleCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<HomepageSlider[]>([]);
  const [loading, setLoading] = useState(true);

  // Default categories similar to OLX
  const defaultCategories = [
    { name: "Cars", slug: "cars", icon: "🚗" },
    { name: "Properties", slug: "properties", icon: "🏢" },
    { name: "Mobiles", slug: "mobiles", icon: "📱" },
    { name: "Jobs", slug: "jobs", icon: "💼" },
    { name: "Fashion", slug: "fashion", icon: "👕" },
    { name: "Bikes", slug: "bikes", icon: "🏍️" },
    { name: "Electronics & Appliances", slug: "electronics", icon: "📺" },
    { name: "Commercial Vehicles & Spares", slug: "commercial", icon: "🚚" },
    { name: "Furniture", slug: "furniture", icon: "🛋️" },
    { name: "Pets", slug: "pets", icon: "🐕" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { enhancedApi } = await import('../lib/api-enhanced');

      // Fetch both categories and sliders in parallel with enhanced error handling
      const [categoriesResponse, slidersResponse] = await Promise.all([
        enhancedApi.get("categories"),
        enhancedApi.get("homepage-sliders")
      ]);

      // Handle categories
      const categoriesData = categoriesResponse.data;
      if (categoriesData.success && categoriesData.data && categoriesData.data.length > 0) {
        setCategories(categoriesData.data.slice(0, 10));
      } else {
        // Use default categories if API fails
        setCategories(defaultCategories as any);
      }

      // Handle sliders
      const slidersData = slidersResponse.data;
      if (slidersData.success && slidersData.data && slidersData.data.length > 0) {
        setSliders(slidersData.data);
      } else {
        // Set default slider if no sliders found or API fails
        setSliders([{
          _id: 'default',
          title: 'Find Properties in Rohtak',
          subtitle: 'Search from thousands of listings',
          icon: '🏠',
          backgroundColor: 'from-[#C70000] to-red-600',
          textColor: 'text-white',
          isActive: true,
          order: 1
        }]);
      }

      // Show user-friendly message if using fallback data
      if (categoriesResponse.fromFallback || slidersResponse.fromFallback) {
        console.warn("🔄 Using offline mode - some content may be limited");
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to default data
      setCategories(defaultCategories as any);
      setSliders([{
        _id: 'default',
        title: 'Find Properties in Rohtak',
        subtitle: 'Search from thousands of listings',
        icon: '🏠',
        backgroundColor: 'from-[#C70000] to-red-600',
        textColor: 'text-white',
        isActive: true,
        order: 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    window.location.href = `/categories/${category.slug}`;
  };

  const handleSellClick = () => {
    window.location.href = "/post-property";
  };

  if (loading) {
    return (
      <div className="bg-white">
        {/* Banner placeholder */}
        <div className="mx-4 mt-4 mb-6">
          <div className="bg-blue-100 rounded-lg h-20 animate-pulse"></div>
        </div>
        
        {/* Categories grid placeholder */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Dynamic Slider Section */}
      <div className="mx-4 mt-4 mb-6">
        <div className="space-y-3">
          {sliders.map((slider) => (
            <div
              key={slider._id}
              className={`bg-gradient-to-r ${slider.backgroundColor} rounded-lg p-4 ${slider.textColor} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{slider.title}</h3>
                  <p className="text-sm opacity-90">{slider.subtitle}</p>
                </div>
                <div className="text-3xl">{slider.icon}</div>
              </div>
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
              <div className="absolute -right-6 -bottom-2 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-5 gap-3">
          {categories.slice(0, 10).map((category, index) => {
            const IconComponent = categoryIcons[category.name] || Building2;
            
            return (
              <div
                key={category._id || category.slug}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center mb-2 hover:bg-red-100 transition-colors">
                  <IconComponent className="h-7 w-7 text-[#C70000]" />
                </div>
                <span className="text-xs text-gray-800 text-center font-medium leading-tight">
                  {category.name.length > 12 ? `${category.name.substring(0, 12)}...` : category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sell Button - OLX Style */}
      <div className="px-4 pb-6">
        <button
          onClick={handleSellClick}
          className="w-full bg-[#C70000] hover:bg-[#A60000] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all"
        >
          <Plus className="h-6 w-6" />
          <span>SELL</span>
        </button>
      </div>

      {/* Call to Action Banner */}
      <div className="mx-4 mb-6">
        <div className="bg-gradient-to-r from-[#C70000] to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Want to see your stuff here?</h3>
              <p className="text-sm opacity-90">Make some extra cash by selling things</p>
            </div>
            <button 
              onClick={handleSellClick}
              className="bg-white text-[#C70000] px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              Start selling
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export with API error boundary for better error handling
export default withApiErrorBoundary(OLXStyleCategories);
