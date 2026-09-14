import { useCallback, useEffect, useState } from 'react';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

const OPTIONS: PositionOptions = {
    maximumAge: process.env.LOCATION_MAX_AGE ? Number(process.env.LOCATION_MAX_AGE) : undefined,
    timeout: process.env.LOCATION_TIMEOUT ? Number(process.env.LOCATION_TIMEOUT) : undefined,
    enableHighAccuracy: process.env.LOCATION_ENABLE_HIGH_ACCURACY?.toLocaleLowerCase() === 'true',
};

export const usePosition = () => {
    const [detected, setDetected] = useState<Coordinates>();
    const [override, setOverride] = useState<Coordinates>();
    const [error, setError] = useState<string>();

    const onChange: PositionCallback = useCallback(position => {
        setDetected({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    }, []);

    const onError: PositionErrorCallback = useCallback(error => {
        setError(error.message);
    }, []);

    useEffect(() => {
        const id = navigator.geolocation?.watchPosition(onChange, onError, OPTIONS);

        return () => navigator.geolocation.clearWatch(id);
    }, [onChange, onError]);

    /* set a coordinate pair directly, bypassing the device's own location */
    const setCoordinates = useCallback((coordinates: Coordinates) => {
        setOverride(coordinates);
    }, []);

    /* drop the override and go back to tracking the device's real location */
    const clearOverride = useCallback(() => {
        setOverride(undefined);
    }, []);

    /* a one-off request tied to a user gesture: some browsers silently ignore watchPosition's
       initial callback when it isn't triggered by a click/tap, so this is the fallback */
    const requestPosition = useCallback(() => {
        navigator.geolocation?.getCurrentPosition(onChange, onError, OPTIONS);
    }, [onChange, onError]);

    return [
        override ?? detected,
        { error, setCoordinates, clearOverride, isOverridden: !!override, requestPosition },
    ] as const;
};
