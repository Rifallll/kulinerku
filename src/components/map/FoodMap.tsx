import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import { getCoordinates } from '@/data/province_coordinates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fixImageUrl } from '@/utils/fixImage';
import { getProvinceFromOrigin } from '@/utils/provinceMapping';

interface DatabaseFood {
    id: string;
    name: string;
    type: string;
    origin: string;
    description: string;
    imageUrl: string;
    rating: number;
}

interface MapFood {
    id: string;
    name: string;
    location: string;
    originalCity: string; // City before province conversion
    lat: number;
    lng: number;
    description: string;
    image: string;
    rating: number;
}

interface CityBreakdown {
    city: string;
    count: number;
    foods: string[]; // Food names
}

interface LocationGroup {
    location: string;
    lat: number;
    lng: number;
    foods: MapFood[];
    avgRating: number;
    cityBreakdown: CityBreakdown[]; // Breakdown by city within province
}


// Custom marker icon with count
const createCustomIcon = (count: number) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #e11d48; border-radius: 50%; padding: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 3px solid #fff;">
            <div style="color: white; font-weight: 700; font-size: 14px;">${count}</div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Component to handle map bounds
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const FoodMap = () => {
    const [mapData, setMapData] = useState<MapFood[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Center of Indonesia
    const center: [number, number] = [-2.5489, 118.0149];
    const zoom = 5;

    // Fetch food data from Supabase
    useEffect(() => {
        async function fetchFoods() {
            try {
                setIsLoading(true);
                const { data, error } = await supabase.from('food_items').select('*');
                if (error) throw error;

                // Map database items to map format with coordinates
                const mapped = (data as DatabaseFood[])
                    .map(food => {
                        const originalCity = food.origin;

                        // Use centralized function to get province
                        const origin = getProvinceFromOrigin(food.origin);

                        // Skip generic "Indonesia" origin
                        if (origin === 'Indonesia') {
                            return null;
                        }

                        const coords = getCoordinates(origin);
                        if (!coords) {
                            console.warn(`No coordinates found for: ${origin} (original: ${food.origin})`);
                            return null;
                        }

                        return {
                            id: food.id,
                            name: food.name,
                            location: origin,
                            originalCity: originalCity, // Keep track of original city
                            lat: coords.lat,
                            lng: coords.lng,
                            description: food.description,
                            image: food.imageUrl,
                            rating: food.rating,
                        };
                    })
                    .filter(Boolean) as MapFood[];

                setMapData(mapped);
                console.log(`Loaded ${mapped.length} food items from database (excluding generic origins)`);
            } catch (err) {
                console.error('Failed to fetch foods:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchFoods();
    }, []);

    // Group foods by province
    const locationGroups = useMemo(() => {
        const groups = new Map<string, LocationGroup>();

        mapData.forEach(food => {
            // Group ONLY by province name, not coordinates
            const key = food.location;

            if (!groups.has(key)) {
                groups.set(key, {
                    location: food.location,
                    lat: food.lat,
                    lng: food.lng,
                    foods: [],
                    avgRating: 0,
                    cityBreakdown: []
                });
            }

            const group = groups.get(key)!;
            group.foods.push(food);
        });

        // Calculate average rating and city breakdown for each province
        groups.forEach(group => {
            const totalRating = group.foods.reduce((sum, food) => sum + food.rating, 0);
            group.avgRating = totalRating / group.foods.length;

            // Calculate city breakdown
            const cityMap = new Map<string, { count: number, foods: string[] }>();
            group.foods.forEach(food => {
                const city = food.originalCity;
                if (!cityMap.has(city)) {
                    cityMap.set(city, { count: 0, foods: [] });
                }
                const cityData = cityMap.get(city)!;
                cityData.count++;
                cityData.foods.push(food.name);
            });

            group.cityBreakdown = Array.from(cityMap.entries())
                .map(([city, data]) => ({
                    city,
                    count: data.count,
                    foods: data.foods
                }))
                .sort((a, b) => b.count - a.count); // Sort by count descending
        });

        console.log('Province groups:', groups.size);
        groups.forEach((g, key) => {
            console.log(`${key}: ${g.foods.length} foods`);
        });

        return Array.from(groups.values());
    }, [mapData]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Memuat peta kuliner...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen rounded-none overflow-hidden shadow-none border-none relative group">
            <style>
                {`
                    .leaflet-container {
                        width: 100%;
                        height: 100%;
                        background-color: #f8fafc;
                        z-index: 10;
                    }
                    .custom-div-icon {
                        background: transparent;
                        border: none;
                    }
                    .leaflet-popup-content-wrapper {
                        border-radius: 12px;
                        padding: 0;
                        max-height: 400px;
                        overflow: hidden;
                    }
                    .leaflet-popup-content {
                        margin: 0;
                        width: 280px !important;
                    }
                    .food-list-item {
                        transition: background-color 0.2s;
                    }
                    .food-list-item:hover {
                        background-color: #fff1f2;
                    }
                `}
            </style>

            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
                <ChangeView center={center} zoom={zoom} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {locationGroups.map((group, idx) => (
                    <Marker
                        key={`${group.location}-${idx}`}
                        position={[group.lat, group.lng]}
                        icon={createCustomIcon(group.foods.length)}
                    >
                        <Tooltip direction="top" offset={[0, -32]} opacity={0.9}>
                            <div className="text-center max-w-[200px]">
                                <div className="font-bold text-rose-600 mb-1">📍 {group.location}</div>
                                <div className="text-xs text-gray-700 space-y-0.5">
                                    {group.foods.slice(0, 5).map((food, idx) => (
                                        <div key={idx}>• {food.name}</div>
                                    ))}
                                    {group.foods.length > 5 && (
                                        <div className="text-gray-500 mt-1">+{group.foods.length - 5} lainnya</div>
                                    )}
                                </div>
                            </div>
                        </Tooltip>

                        <Popup className="food-popup" maxWidth={300}>
                            <div className="max-h-[500px] overflow-y-auto">
                                {/* Header */}
                                <div className="bg-rose-600 text-white p-3 sticky top-0 z-10">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-base leading-tight">📍 {group.location}</h3>
                                            <p className="text-xs text-rose-100 mt-1">{group.foods.length} Kuliner Khas</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                                            <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                                            <span className="text-xs font-semibold">{group.avgRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* City Dist ribution Breakdown */}
                                {group.cityBreakdown.length > 1 && (
                                    <div className="bg-gray-50 p-3 border-b">
                                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Penyebaran di {group.location}:</h4>
                                        <div className="space-y-1">
                                            {group.cityBreakdown.map((city, idx) => (
                                                <div key={idx} className="text-xs flex justify-between items-center">
                                                    <span className="text-gray-600">📍 {city.city}</span>
                                                    <span className="font-semibold text-rose-600">{city.count} makanan</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Food List */}
                                <div className="divide-y divide-gray-100">
                                    {group.foods.map(food => (
                                        <div key={food.id} className="food-list-item p-3">
                                            <div className="flex gap-3">
                                                <img
                                                    src={fixImageUrl(food.name, food.image)}
                                                    alt={food.name}
                                                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Food";
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm text-rose-600 truncate">{food.name}</h4>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs text-gray-600">{food.rating.toFixed(1)}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{food.description}</p>
                                                    <Link to={`/recipe/${food.id}`}>
                                                        <Button size="sm" variant="link" className="h-auto p-0 mt-1 text-xs text-rose-600">
                                                            Lihat Detail →
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FoodMap;
