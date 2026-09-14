import { useEffect, useState } from 'react';

const getRoute = () => window.location.hash.replace(/^#\/?/, '');

export const useHashRoute = () => {
    const [route, setRoute] = useState(getRoute);

    useEffect(() => {
        const onHashChange = () => setRoute(getRoute());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return route;
};
