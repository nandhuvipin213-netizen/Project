
interface GeocodingResult {
    lat: string;
    lon: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export const geocodeAddress = async (
    address: string
): Promise<Coordinates | null> => {
    const url = new URL("https://nominatim.openstreetmap.org/search");

    url.searchParams.set("q", address);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "in");

    const response = await fetch(url, {
        headers: {
            "User-Agent": "SmartLogisticsPlatform/1.0",
            "Accept-Language": "en",
        },
    });

    if (!response.ok) {
        throw new Error(`Geocoding service error: ${response.status}`);
    }

    const results = (await response.json()) as GeocodingResult[];

    const firstResult = results[0];

    if (!firstResult) {
        return null;
    }

    return {
        lat: Number(firstResult.lat),
        lng: Number(firstResult.lon),
    };
}