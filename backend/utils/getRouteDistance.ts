interface Coordinates {
    lat: number;
    lng: number;
}

export const getRouteDistance = async (
    pickup: Coordinates,
    delivery: Coordinates
): Promise<number> => {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${delivery.lng},${delivery.lat}?overview=false`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to calculate route distance");
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error("No driving route found");
    }

    // Convert metres into kilometres
    return Number((data.routes[0].distance / 1000).toFixed(2));
};