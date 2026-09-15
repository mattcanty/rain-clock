import React, { memo, useEffect, useRef, useState } from 'react';

import { Coordinates } from '../../utils/use-position';
import { useAutoRefresh, useLocation } from '../ForecastProvider/ForecastProvider';
import styles from './location-box.module.scss';

const PRECISION = 4;

export const format = (position: Coordinates | undefined) =>
    position ? `${position.latitude.toFixed(PRECISION)},${position.longitude.toFixed(PRECISION)}` : '';

export const parse = (value: string): Coordinates | undefined => {
    const [latString, lonString] = value.split(',').map(part => part.trim());
    const latitude = Number(latString);
    const longitude = Number(lonString);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return undefined;

    return { latitude, longitude };
};

export const LocationBox: React.FunctionComponent = () => {
    const [position, { setCoordinates, clearOverride, isOverridden, refreshNow, requestPosition, locationError }] =
        useLocation();
    const [, resumeAutoRefresh] = useAutoRefresh();
    const [value, setValue] = useState(() => format(position));
    const editing = useRef(false);
    const requestedOnFocus = useRef(false);

    useEffect(() => {
        if (!editing.current) setValue(format(position));
    }, [position]);

    useEffect(() => {
        requestPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const commit = () => {
        editing.current = false;
        const trimmed = value.trim();

        if (!trimmed) {
            // dropping an override changes the effective location, which already triggers its own
            // fetch; only force one here when there was nothing to drop (already the real location)
            clearOverride();
            resumeAutoRefresh();
            if (!isOverridden) refreshNow();
            return;
        }

        const coordinates = parse(trimmed);
        if (!coordinates) {
            setValue(format(position));
            return;
        }

        // retyping exactly what's already shown (compared at display precision, since the
        // underlying device coordinates carry far more decimal places) means "just refresh this",
        // not "pin a new override" — otherwise resubmitting a live GPS reading would needlessly
        // freeze it in place
        if (format(position) === format(coordinates)) {
            resumeAutoRefresh();
            refreshNow();
            return;
        }

        setCoordinates(coordinates);
        resumeAutoRefresh();
    };

    // drops any pinned override and asks the browser for its own location again; mirrors
    // emptying the input, but also forces a fresh request rather than waiting on watchPosition
    const reset = () => {
        clearOverride();
        requestPosition();
        resumeAutoRefresh();
        if (!isOverridden) refreshNow();
    };

    return (
        <div className={styles.container}>
            <input
                className={styles.location}
                value={value}
                onFocus={() => {
                    editing.current = true;
                    // only ever retry once from a click/tap — re-requesting on every focus can pop a
                    // permission prompt each time, which steals focus right as you're trying to paste
                    if (!position && !requestedOnFocus.current) {
                        requestedOnFocus.current = true;
                        requestPosition();
                    }
                }}
                onChange={event => setValue(event.target.value)}
                onBlur={commit}
                onKeyDown={event => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                }}
                placeholder={!position && locationError ? locationError : 'latitude,longitude'}
                title={!position && locationError ? locationError : undefined}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                aria-label="Location, as latitude,longitude"
            />
            <button
                type="button"
                className={styles.reset}
                onClick={reset}
                aria-label="Reset to detected location"
                title="Reset to detected location"
            >
                ↺
            </button>
        </div>
    );
};

export default memo(LocationBox);
