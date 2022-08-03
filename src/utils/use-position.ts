import { useCallback, useEffect, useState } from 'react';

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
        console.warn(navigator.geolocation);
        const id = navigator.geolocation?.watchPosition(onChange, onError);

        return () => navigator.geolocation.clearWatch(id);
    }, [onChange, onError]);

    const fetch = useCallback(() => {
        navigator.geolocation?.getCurrentPosition(onChange);
    }, [onChange]);

    return [position, { error, fetch }] as const;
};
