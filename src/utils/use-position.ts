import { useCallback, useEffect, useState } from 'react';

const OPTIONS: PositionOptions = {
    maximumAge: process.env.LOCATION_MAX_AGE ? Number(process.env.LOCATION_MAX_AGE) : undefined,
    timeout: process.env.LOCATION_TIMEOUT ? Number(process.env.LOCATION_TIMEOUT) : undefined,
    enableHighAccuracy: process.env.LOCATION_ENABLE_HIGH_ACCURACY?.toLocaleLowerCase() === 'true',
};

export const usePosition = () => {
    const [position, setPosition] = useState<GeolocationPosition>();
    const [error, setError] = useState<string>();

    const onChange: PositionCallback = useCallback(position => {
        setPosition(position);
    }, []);

    const onError: PositionErrorCallback = useCallback(error => {
        setError(error.message);
    }, []);

    useEffect(() => {
        const id = navigator.geolocation?.watchPosition(onChange, onError, OPTIONS);

        return () => navigator.geolocation.clearWatch(id);
    }, [onChange, onError]);

    const fetch = useCallback(() => {
        navigator.geolocation?.getCurrentPosition(onChange);
    }, [onChange]);

    return [position, { error, fetch }] as const;
};
