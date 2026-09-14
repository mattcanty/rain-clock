import { useState } from 'react';
import useInterval from 'use-interval';

export const useNow = (intervalMs: number) => {
    const [now, setNow] = useState(() => Date.now());
    useInterval(() => setNow(Date.now()), intervalMs);
    return now;
};
