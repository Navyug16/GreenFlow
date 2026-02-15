
// Basic distance helper (Euclidean approximation is sufficient for local sorting)
const getDistance = (p1: { lat: number, lng: number }, p2: { lat: number, lng: number }) => {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
};

// 1. Route Clustering: Group bins by their assigned Route ID or proximity
export const clusterBinsByTruck = (trucks: any[], bins: any[]) => {
    const clusters: Record<string, any[]> = {};

    // Initialize clusters
    trucks.forEach(t => clusters[t.id] = []);

    bins.forEach(bin => {
        // Essential Logic: If bin has a routeId, assign to that truck. 
        // Otherwise, find nearest truck (or generic load balancing).
        if (bin.routeId && clusters[bin.routeId]) {
            clusters[bin.routeId].push(bin);
        } else if (bin.status !== 'empty' && bin.fillLevel > 50) {
            // Unassigned bin that needs pickup: Assign to nearest truck
            let closestTruckId = null;
            let minDst = Infinity;

            trucks.forEach(t => {
                // Very rough position approximation based on region if no live pos
                // In real app, pass live coords here
                const tPos = { lat: 24.71, lng: 46.67 };
                const d = getDistance(bin, tPos);
                if (d < minDst) {
                    minDst = d;
                    closestTruckId = t.id;
                }
            });

            if (closestTruckId && clusters[closestTruckId]) {
                clusters[closestTruckId].push(bin);
            }
        }
    });

    return clusters;
};

// 2. Sequence Optimization: TSP (Nearest Neighbor with Return-to-Depot consideration)
export const optimizeStopSequence = (
    startPos: [number, number],
    endPos: [number, number],
    stops: any[]
): any[] => {
    if (stops.length === 0) return [];

    const orderedStops: any[] = [];
    const remaining = [...stops];
    let currentLoc = { lat: startPos[0], lng: startPos[1] };

    // Nearest Neighbor Heuristic
    while (remaining.length > 0) {
        let nearestIdx = -1;
        let minDst = Infinity;

        remaining.forEach((stop, idx) => {
            const d = getDistance(currentLoc, stop);
            // Heuristic: Distance to current + small weight towards destination
            const distToEnd = getDistance(stop, { lat: endPos[0], lng: endPos[1] });
            const score = d + (distToEnd * 0.1); // Bias slightly towards end goal

            if (score < minDst) {
                minDst = score;
                nearestIdx = idx;
            }
        });

        if (nearestIdx !== -1) {
            const nextStop = remaining[nearestIdx];
            orderedStops.push(nextStop);
            currentLoc = nextStop;
            remaining.splice(nearestIdx, 1);
        }
    }

    return orderedStops;
};
