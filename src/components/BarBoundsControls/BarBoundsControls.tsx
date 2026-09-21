import React, { memo, useEffect, useState } from 'react';

import { useHashRoute } from '../../utils/use-hash-route';
import {
    RainBandKey,
    RainSettings,
    clampRainSettings,
    isBarBoundsFeatureEnabled,
    readStoredRainSettings,
    writeStoredRainSettings,
} from '../WaterLevelFace/bar-bounds';
import styles from './bar-bounds-controls.module.scss';

const formatUnit = (value: number) => value.toFixed(2);
const formatMm = (value: number) => `${value.toFixed(2)}mm`;
const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const BAND_LABELS: Record<RainBandKey, string> = { light: 'Light', moderate: 'Moderate', heavy: 'Heavy' };
const BAND_KEYS: RainBandKey[] = ['light', 'moderate', 'heavy'];

const updateSettings = (
    setSettings: React.Dispatch<React.SetStateAction<RainSettings>>,
    next: (current: RainSettings) => RainSettings,
) => {
    setSettings(current => {
        const clamped = clampRainSettings(next(current));
        writeStoredRainSettings(clamped);
        return clamped;
    });
};

export const BarBoundsControls: React.FunctionComponent = () => {
    const route = useHashRoute();
    const [settings, setSettings] = useState(readStoredRainSettings);
    const enabled = isBarBoundsFeatureEnabled(route);

    useEffect(() => {
        if (enabled) setSettings(readStoredRainSettings());
    }, [enabled]);

    if (!enabled) return null;

    return (
        <fieldset className={styles.container}>
            <legend className={styles.legend}>Rain bar bounds</legend>
            <label className={styles.row}>
                <span>Upper</span>
                <input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={formatUnit(settings.upper)}
                    aria-label="Upper rain bar bound"
                    aria-valuetext={formatUnit(settings.upper)}
                    onChange={event => {
                        // capture the value synchronously: the native event's currentTarget is
                        // nulled out once dispatch finishes, so it can't be read from inside the
                        // updater below, which React may invoke again later
                        const value = Number(event.currentTarget.value);
                        updateSettings(setSettings, current => ({ ...current, upper: value }));
                    }}
                />
                <output>{formatUnit(settings.upper)}</output>
            </label>
            <label className={styles.row}>
                <span>Lower</span>
                <input
                    type="range"
                    min="0"
                    max="0.99"
                    step="0.01"
                    value={formatUnit(settings.lower)}
                    aria-label="Lower rain bar bound"
                    aria-valuetext={formatUnit(settings.lower)}
                    onChange={event => {
                        const value = Number(event.currentTarget.value);
                        updateSettings(setSettings, current => ({ ...current, lower: value }));
                    }}
                />
                <output>{formatUnit(settings.lower)}</output>
            </label>

            <legend className={styles.legend}>Rain intensity bands (mm/h)</legend>
            {BAND_KEYS.map(key => (
                <label key={key} className={styles.row}>
                    <span>{BAND_LABELS[key]}</span>
                    <input
                        type="range"
                        min="0.01"
                        max="5"
                        step="0.01"
                        value={formatUnit(settings.bands[key].threshold)}
                        aria-label={`${BAND_LABELS[key]} rain band threshold`}
                        aria-valuetext={formatMm(settings.bands[key].threshold)}
                        onChange={event => {
                            const value = Number(event.currentTarget.value);
                            updateSettings(setSettings, current => ({
                                ...current,
                                bands: { ...current.bands, [key]: { ...current.bands[key], threshold: value } },
                            }));
                        }}
                    />
                    <output>{formatMm(settings.bands[key].threshold)}</output>
                </label>
            ))}

            <legend className={styles.legend}>Rain bar colours</legend>
            {BAND_KEYS.map(key => (
                <label key={key} className={styles.colorRow}>
                    <span>{BAND_LABELS[key]}</span>
                    <input
                        type="color"
                        value={settings.bands[key].color}
                        aria-label={`${BAND_LABELS[key]} rain band colour`}
                        onChange={event => {
                            const value = event.currentTarget.value;
                            updateSettings(setSettings, current => ({
                                ...current,
                                bands: { ...current.bands, [key]: { ...current.bands[key], color: value } },
                            }));
                        }}
                    />
                </label>
            ))}
            <label className={styles.colorRow}>
                <span>Extreme</span>
                <input
                    type="color"
                    value={settings.extremeColor}
                    aria-label="Extreme rain colour"
                    onChange={event => {
                        const value = event.currentTarget.value;
                        updateSettings(setSettings, current => ({ ...current, extremeColor: value }));
                    }}
                />
            </label>

            <legend className={styles.legend}>Rain chance (%) saturation range</legend>
            <label className={styles.row}>
                <span>Floor</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formatUnit(settings.probabilityFloor)}
                    aria-label="Rain chance colour floor"
                    aria-valuetext={formatPercent(settings.probabilityFloor)}
                    onChange={event => {
                        const value = Number(event.currentTarget.value);
                        updateSettings(setSettings, current => ({ ...current, probabilityFloor: value }));
                    }}
                />
                <output>{formatPercent(settings.probabilityFloor)}</output>
            </label>
            <label className={styles.row}>
                <span>Ceiling</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formatUnit(settings.probabilityCeiling)}
                    aria-label="Rain chance colour ceiling"
                    aria-valuetext={formatPercent(settings.probabilityCeiling)}
                    onChange={event => {
                        const value = Number(event.currentTarget.value);
                        updateSettings(setSettings, current => ({ ...current, probabilityCeiling: value }));
                    }}
                />
                <output>{formatPercent(settings.probabilityCeiling)}</output>
            </label>
        </fieldset>
    );
};

export default memo(BarBoundsControls);
