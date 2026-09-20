import React, { memo, useEffect, useState } from 'react';

import { useHashRoute } from '../../utils/use-hash-route';
import {
    BarBounds,
    clampBarBounds,
    isBarBoundsFeatureEnabled,
    readStoredBarBounds,
    writeStoredBarBounds,
} from '../WaterLevelFace/bar-bounds';
import styles from './bar-bounds-controls.module.scss';

const formatValue = (value: number) => value.toFixed(2);

const updateBounds = (setBounds: React.Dispatch<React.SetStateAction<BarBounds>>, bounds: BarBounds) => {
    const clamped = clampBarBounds(bounds);
    setBounds(clamped);
    writeStoredBarBounds(clamped);
};

export const BarBoundsControls: React.FunctionComponent = () => {
    const route = useHashRoute();
    const [bounds, setBounds] = useState(readStoredBarBounds);
    const enabled = isBarBoundsFeatureEnabled(route);

    useEffect(() => {
        if (enabled) setBounds(readStoredBarBounds());
    }, [enabled]);

    if (!enabled) return null;

    return (
        <fieldset className={styles.container} aria-label="Rain bar tuning">
            <legend className={styles.legend}>Rain bar bounds</legend>
            <label className={styles.row}>
                <span>Upper</span>
                <input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={formatValue(bounds.upper)}
                    onChange={event => updateBounds(setBounds, { ...bounds, upper: Number(event.target.value) })}
                />
                <output>{formatValue(bounds.upper)}</output>
            </label>
            <label className={styles.row}>
                <span>Lower</span>
                <input
                    type="range"
                    min="0"
                    max="0.99"
                    step="0.01"
                    value={formatValue(bounds.lower)}
                    onChange={event => updateBounds(setBounds, { ...bounds, lower: Number(event.target.value) })}
                />
                <output>{formatValue(bounds.lower)}</output>
            </label>
        </fieldset>
    );
};

export default memo(BarBoundsControls);
