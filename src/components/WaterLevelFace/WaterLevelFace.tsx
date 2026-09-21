import * as d3 from 'd3';
import React, { memo, useEffect, useMemo, useState } from 'react';

import { getSimulatedData } from '../../utils/get-simulated-data';
import { useD3 } from '../../utils/use-d3';
import { useNow } from '../../utils/use-now';
import ClockFace from '../ClockFace/ClockFace';
import { useForecast } from '../ForecastProvider/ForecastProvider';
import {
    BAR_BOUNDS_CHANGED_EVENT,
    BarBounds,
    DEFAULT_BAR_BOUNDS,
    RainBandKey,
    RainBands,
    RainSettings,
    clampRainSettings,
    readStoredRainSettings,
} from './bar-bounds';

const RAIN_BAND_LABELS: Record<RainBandKey, string> = { light: 'Light', moderate: 'Moderate', heavy: 'Heavy' };
const RAIN_BAND_KEYS: RainBandKey[] = ['light', 'moderate', 'heavy'];

type RainBandEntry = { key: RainBandKey; label: string; threshold: number; color: string };

const bandEntries = (bands: RainBands): RainBandEntry[] =>
    RAIN_BAND_KEYS.map(key => ({ key, label: RAIN_BAND_LABELS[key], ...bands[key] }));

/* the band whose threshold the reading falls at or under; anything past "heavy" is handled
   separately as an extreme reading rather than folded into the heavy band's own colour */
const bandForIntensity = (intensity: number, bands: RainBands) => {
    if (intensity <= bands.light.threshold) return bands.light;
    if (intensity <= bands.moderate.threshold) return bands.moderate;
    return bands.heavy;
};

/* probability drives how deep/saturated a band's colour reads, interpolated from white up to
   the band's full colour across the configured probability floor/ceiling */
const probabilityTint = (color: string, probability: number, floor: number, ceiling: number) =>
    d3.interpolateRgb('white', color)(floor + probability * (ceiling - floor));

type WaterLevelFaceProps = React.HTMLAttributes<HTMLDivElement> & {};

const minutes = {
    toRadians: d3
        .scaleLinear()
        .domain([0, 60])
        .range([0, Math.PI * 2]),
};

/* below this, rain is indistinguishable from "none" for display purposes (scaleLog can't take 0) */
export const INTENSITY_FLOOR = 0.01;

/* logarithmic, not linear: a single extreme reading (e.g. a downpour elsewhere) used to
   drag the whole scale out and flatten everything else near the rim. On a log scale it
   takes a 10x jump in intensity to move the same distance toward the centre, so ordinary
   rain stays legible even when the domain has to stretch to fit a rare heavy spike. */
export const createIntensityScale = (max: number, bounds: BarBounds = DEFAULT_BAR_BOUNDS) =>
    d3
        .scaleLog()
        .range([bounds.upper, bounds.lower])
        .domain([INTENSITY_FLOOR, Math.max(max, INTENSITY_FLOOR * 10)])
        .clamp(true);

const useRainSettings = () => {
    const [settings, setSettings] = useState<RainSettings>(readStoredRainSettings);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onUpdate = () => setSettings(readStoredRainSettings());
        window.addEventListener(BAR_BOUNDS_CHANGED_EVENT, onUpdate);
        window.addEventListener('storage', onUpdate);
        return () => {
            window.removeEventListener(BAR_BOUNDS_CHANGED_EVENT, onUpdate);
            window.removeEventListener('storage', onUpdate);
        };
    }, []);

    return clampRainSettings(settings);
};

const useIntensityScale = (settings: RainSettings) => {
    const forecast = useForecast();
    const heaviest = settings.bands.heavy.threshold;

    const max = Math.max(heaviest, d3.max(forecast, d => d.precipIntensity) ?? 0);
    return useMemo(
        () =>
            createIntensityScale(max)
                .range([settings.upper, settings.lower])
                .clamp(true),
        [settings.lower, settings.upper, max],
    );
};

/* re-checked this often so elapsed minutes drop off the ring as the clock hand passes them */
const PAST_CHECK_INTERVAL = 15 * 1000;

/* one wedge per forecast minute, angularly aligned to that minute's tick on the clock face */
type Bar = {
    key: number;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    probability: number;
    /* heavier than the "heavy" band's threshold — flagged with its own colour rather than
       just a deeper shade of the usual one, so a freak spike can't be mistaken for ordinary
       heavy rain */
    extreme: boolean;
    color: string;
    stroke: string;
};

const useBars = (settings: RainSettings): Bar[] => {
    const forecast = useForecast();
    const toRadius = useIntensityScale(settings);
    const now = useNow(PAST_CHECK_INTERVAL);

    return forecast
        .filter(d => d.time > now)
        .map(d => {
            const minute = new Date(d.time).getMinutes();
            const extreme = d.precipIntensity > settings.bands.heavy.threshold;
            const baseColor = extreme ? settings.extremeColor : bandForIntensity(d.precipIntensity, settings.bands).color;
            const color = probabilityTint(baseColor, d.precipProbability, settings.probabilityFloor, settings.probabilityCeiling);
            const stroke = (d3.color(baseColor) as d3.RGBColor).darker(0.6).formatHex();

            return {
                key: d.time,
                startAngle: minutes.toRadians(minute),
                endAngle: minutes.toRadians(minute + 1),
                innerRadius: toRadius(d.precipIntensity),
                outerRadius: settings.upper,
                probability: d.precipProbability,
                extreme,
                color,
                stroke,
            };
        });
};

const barColor = (d: Bar) => d.color;
const barStroke = (d: Bar) => d.stroke;

const barArc = d3
    .arc<Bar>()
    .innerRadius(d => d.innerRadius)
    .outerRadius(d => d.outerRadius)
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .padAngle(0.035)
    .padRadius(1);

const DATA_POINTS = getSimulatedData().map<[number, number]>((_, i, { length }) => [(2 * Math.PI * i) / length, 1]);
const INITIAL_PATH = d3.areaRadial().curve(d3.curveBasis).innerRadius(1)(DATA_POINTS);

export const WaterLevelFace: React.FunctionComponent<WaterLevelFaceProps> = props => {
    const settings = useRainSettings();
    const forecast = useForecast();
    const bars = useBars(settings);
    const toRadius = useIntensityScale(settings);
    const bands = useMemo(() => bandEntries(settings.bands), [settings.bands]);
    const face = useD3(
        container => {
            if (!container.select('svg').node()) {
                const svg = container
                    .append('svg')
                    .attr('viewBox', `0 0 2.2 2.2`)
                    .attr('width', '100%')
                    .attr('height', 'auto')
                    .attr('preserveAspectRatio', 'xMidYMid meet');

                // draw rain intensity bands
                const axis = svg
                    .append('g')
                    .attr('transform', 'translate(1.1,1.1)')
                    .attr('class', 'axis-group')
                    .selectAll<SVGGElement, RainBandEntry>('g')
                    .data(bands, d => d.key)
                    .enter()
                    .append('g')
                    .attr('class', d => 'axis ' + d.key);
                axis.append('circle');
                axis.append('text')
                    .attr('x', 0.05)
                    .text(d => d.label);

                // draw an initial full circle, flush with the rim, to enable the first transition in
                const placeholder = svg.append('g').append('path').attr('class', 'placeholder');
                placeholder
                    .attr('transform', 'translate(1.1,1.1)')
                    .attr('fill', 'lightsteelblue')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 0.01)
                    .attr('opacity', 0.8)
                    .attr('d', INITIAL_PATH);

                svg.append('g').attr('class', 'bars-group').attr('transform', 'translate(1.1,1.1)');
            }

            // skip until the first forecast arrives (keeps the placeholder circle); after that, an
            // empty (all-past) forecast clears the bars instead of freezing on stale data
            if (forecast.length > 0) {
                container.select('.placeholder').remove();

                container
                    .select('.bars-group')
                    .selectAll<SVGPathElement, Bar>('path.bar')
                    .data(bars, d => d.key)
                    .join(
                        enter =>
                            enter
                                .append('path')
                                .attr('class', 'bar')
                                .attr('stroke-width', 0.004)
                                .attr('fill', barColor)
                                .attr('stroke', barStroke)
                                .attr('d', barArc),
                        update => update,
                        exit => exit.remove(),
                    )
                    .transition()
                    .duration(400)
                    .attr('fill', barColor)
                    .attr('stroke', barStroke)
                    .attr('d', barArc);
            }

            // position bands to match the current intensity scale, and rebind so their labelled
            // threshold (mm) reflects any edits made since the axis groups were first drawn
            container
                .select('.axis-group')
                .selectAll<SVGGElement, RainBandEntry>('g')
                .data(bands, d => d.key)
                .each(function (d) {
                    const r = toRadius(d.threshold);
                    d3.select(this).select('circle').attr('r', r);
                    d3.select(this).select('text').attr('y', -r - 0.014);
                });
        },
        [bars, toRadius, bands],
    );

    return <ClockFace ref={face} {...props} />;
};

WaterLevelFace.defaultProps = {
    id: 'water-level',
};

export default memo(WaterLevelFace);
