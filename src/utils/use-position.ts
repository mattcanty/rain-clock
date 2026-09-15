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

/* a manual override (e.g. for when IP-based geolocation lands nowhere near the device) needs to
   survive a reload, otherwise it's silently dropped back to whatever the browser detects next */
const OVERRIDE_STORAGE_KEY = 'rain-clock:location-override';

const readStoredOverride = (): Coordinates | undefined => {
    try {
        const raw = localStorage.getItem(OVERRIDE_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : undefined;
        if (typeof parsed?.latitude !== 'number' || typeof parsed?.longitude !== 'number') return undefined;
        return parsed;
    } catch {
        return undefined;
    }
};

const writeStoredOverride = (coordinates: Coordinates | undefined) => {
    try {
        if (coordinates) localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(coordinates));
        else localStorage.removeItem(OVERRIDE_STORAGE_KEY);
    } catch {
        // storage unavailable (private browsing, disabled) - the override still works for this
        // tab via React state, it just won't survive a reload
    }
};

export const usePosition = () => {
    const [detected, setDetected] = useState<Coordinates>();
    const [override, setOverride] = useState<Coordinates | undefined>(readStoredOverride);
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
        writeStoredOverride(coordinates);
    }, []);

    /* drop the override and go back to tracking the device's real location */
    const clearOverride = useCallback(() => {
        setOverride(undefined);
        writeStoredOverride(undefined);
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
