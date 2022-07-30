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
        const id = navigator.geolocation?.watchPosition(onChange, onError);

        return () => navigator.geolocation.clearWatch(id);
    }, []);

    return [position, error];
};
