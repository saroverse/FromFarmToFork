/**
 * Geocodes an address string to latitude and longitude using OpenStreetMap Nominatim API.
 * This is a free service that does not require an API key for low-volume usage.
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; display_name: string } | null> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    
    if (!response.ok) {
        throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

/**
 * Returns a list of address suggestions based on a query string.
 */
export const searchAddressSuggestions = async (query: string): Promise<Array<{ lat: number; lng: number; display_name: string }>> => {
  try {
    if (query.length < 3) return [];
    
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
    
    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      display_name: item.display_name
    }));
  } catch (error) {
    console.error("Suggestion error:", error);
    return [];
  }
};