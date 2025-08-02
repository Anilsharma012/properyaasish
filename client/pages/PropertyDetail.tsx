import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Share2,
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ChatBot from "../components/ChatBot";

interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  subCategory: string;
  price: number;
  priceType: "sale" | "rent";
  location: {
    city: string;
    state: string;
    address: string;
    area?: string;
  };
  contactInfo: {
    name: string;
    phone: string;
    whatsappNumber?: string;
    email: string;
  };
  images: string[];
  status: "active" | "inactive" | "sold" | "rented";
  featured: boolean;
  premium: boolean;
  specifications?: {
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
    facing?: string;
    floor?: string;
    totalFloors?: string;
    parking?: boolean;
    furnished?: string;
  };
  amenities?: string[];
  views: number;
  inquiries: number;
  createdAt: string;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
      trackView();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProperty(data.data);
        } else {
          setError(data.error || "Property not found");
        }
      } else {
        setError("Failed to load property");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      setError("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch(`/api/analytics/view/${id}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const handleCall = (phoneNumber: string) => {
    // Track phone click
    fetch(`/api/analytics/phone/${id}`, { method: "POST" }).catch(console.error);
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const message = `Hi, I'm interested in your property: ${property?.title}`;
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleStartChat = () => {
    // Try to navigate to chat page first
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        // Navigate to chat page with property context
        navigate('/chat', {
          state: {
            propertyId: property?._id,
            sellerId: property?.ownerId,
            propertyTitle: property?.title
          }
        });
      } else {
        // If not logged in, redirect to login first
        navigate('/login', {
          state: {
            redirectTo: `/property/${id}`,
            message: 'Please login to start chat'
          }
        });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      // Fallback to WhatsApp
      if (property?.contactInfo.whatsappNumber) {
        handleWhatsApp(property.contactInfo.whatsappNumber);
      } else {
        handleWhatsApp(property.contactInfo.phone);
      }
    }
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#C70000] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery & Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {property.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    {property.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      </>
                    )}
                    {property.featured && (
                      <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {property.premium && (
                      <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                        Premium
                      </Badge>
                    )}
                  </div>
                  {property.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className={`w-20 h-16 object-cover rounded cursor-pointer border-2 ${
                            index === currentImageIndex ? 'border-[#C70000]' : 'border-transparent'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location.area}, {property.location.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#C70000]">
                      ₹{property.price.toLocaleString()}
                      {property.priceType === "rent" && <span className="text-lg">/month</span>}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      For {property.priceType}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Specifications */}
                {property.specifications && (
                  <div>
                    <h3 className="font-semibold mb-3">Property Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {property.specifications.bedrooms && (
                        <div className="flex items-center space-x-2">
                          <Bed className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{property.specifications.bedrooms} Bedrooms</span>
                        </div>
                      )}
                      {property.specifications.bathrooms && (
                        <div className="flex items-center space-x-2">
                          <Bath className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{property.specifications.bathrooms} Bathrooms</span>
                        </div>
                      )}
                      {property.specifications.area && (
                        <div className="flex items-center space-x-2">
                          <Square className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{property.specifications.area}</span>
                        </div>
                      )}
                      {property.specifications.parking && (
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Parking</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{property.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Action Buttons */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{property.contactInfo.name}</p>
                  <p className="text-sm text-gray-600">{property.contactInfo.email}</p>
                </div>

                {/* Action Buttons */}
                {/* Desktop Contact Actions */}
                <div className="space-y-3 hidden md:block">
                  <Button
                    className="w-full bg-[#C70000] hover:bg-[#A60000] text-white flex items-center justify-center space-x-2 py-3"
                    onClick={handleStartChat}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Start Chat</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-[#C70000] text-[#C70000] hover:bg-[#C70000] hover:text-white flex items-center justify-center space-x-2 py-3"
                    onClick={() => handleCall(property.contactInfo.phone)}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Now</span>
                  </Button>

                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2 py-3"
                    onClick={() => handleWhatsApp(property.contactInfo.whatsappNumber || property.contactInfo.phone)}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309"/>
                    </svg>
                    <span>WhatsApp</span>
                  </Button>
                </div>

                {/* Mobile Contact Actions - Grid Layout */}
                <div className="grid grid-cols-3 gap-2 md:hidden">
                  <Button
                    className="bg-[#C70000] hover:bg-[#A60000] text-white flex flex-col items-center justify-center space-y-1 py-4"
                    onClick={handleStartChat}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-xs">Chat</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#C70000] text-[#C70000] hover:bg-[#C70000] hover:text-white flex flex-col items-center justify-center space-y-1 py-4"
                    onClick={() => handleCall(property.contactInfo.phone)}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-xs">Call</span>
                  </Button>

                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center space-y-1 py-4"
                    onClick={() => handleWhatsApp(property.contactInfo.whatsappNumber || property.contactInfo.phone)}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309"/>
                    </svg>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Contact details are verified by our team
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Address:</span> {property.location.address}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Area:</span> {property.location.area}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">City:</span> {property.location.city}, {property.location.state}
                  </p>
                </div>
                <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map view (Coming soon)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ChatBot Integration */}
      {property && (
        <ChatBot
          propertyId={property._id}
          sellerId={property.userId}
          sellerName={property.contactInfo.name}
          propertyTitle={property.title}
          propertyPrice={property.price}
          propertyImage={property.images[0]}
          propertyLocation={property.location.address}
          position="bottom-right"
          theme="red"
          enableHumanHandoff={true}
        />
      )}
    </div>
  );
}
