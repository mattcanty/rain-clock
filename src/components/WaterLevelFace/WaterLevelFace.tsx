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
    clampBarBounds,
    readStoredBarBounds,
} from './bar-bounds';

type WaterLevelFaceProps = React.HTMLAttributes<HTMLDivElement> & {};

const minutes = {
    toRadians: d3
        .scaleLinear()
        .domain([0, 60])
        .range([0, Math.PI * 2]),
};

/* precipitation intensity bands, in OpenWeatherMap's units (mm, replacing Dark Sky's in/h) */
const maxExpectedPrecipIntensity = 1;

const RAIN_BANDS = [
    { label: 'Light', value: 0.1 },
    { label: 'Moderate', value: 0.4 },
    { label: 'Heavy', value: maxExpectedPrecipIntensity },
] as const;

/* below this, rain is indistinguishable from "none" for display purposes (scaleLog can't take 0) */
export const INTENSITY_FLOOR = 0.01;

/* logarithmic, not linear: a single extreme reading (e.g. a downpour elsewhere) used to
   drag the whole scale out and flatten everything else near the rim. On a log scale it
   takes a 10x jump in intensity to move the same distance toward the centre, so ordinary
   rain stays legible even when the domain has to stretch to fit a rare heavy spike. */
export const createIntensityScale = (max: number) =>
    d3
        .scaleLog()
        .range([DEFAULT_BAR_BOUNDS.upper, DEFAULT_BAR_BOUNDS.lower])
        .domain([INTENSITY_FLOOR, Math.max(max, INTENSITY_FLOOR * 10)])
        .clamp(true);

const useBarBounds = () => {
    const [bounds, setBounds] = useState<BarBounds>(readStoredBarBounds);

    useEffect(() => {
        const onUpdate = () => setBounds(readStoredBarBounds());
        window.addEventListener(BAR_BOUNDS_CHANGED_EVENT, onUpdate);
        window.addEventListener('storage', onUpdate);
        return () => {
            window.removeEventListener(BAR_BOUNDS_CHANGED_EVENT, onUpdate);
            window.removeEventListener('storage', onUpdate);
        };
    }, []);

    return clampBarBounds(bounds);
};

const useIntensityScale = (bounds: BarBounds) => {
    const forecast = useForecast();

    const max = Math.max(maxExpectedPrecipIntensity, d3.max(forecast, d => d.precipIntensity) ?? 0);
    return useMemo(
        () =>
            createIntensityScale(max)
                .range([bounds.upper, bounds.lower])
                .clamp(true),
        [bounds.lower, bounds.upper, max],
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
    /* heavier than the "typical" heavy-rain reference — flagged with its own colour rather
       than just a deeper shade of the usual one, so a freak spike can't be mistaken for
       ordinary heavy rain */
    extreme: boolean;
};

const useBars = (bounds: BarBounds): Bar[] => {
    const forecast = useForecast();
    const toRadius = useIntensityScale(bounds);
    const now = useNow(PAST_CHECK_INTERVAL);

    return forecast
        .filter(d => d.time > now)
        .map(d => {
            const minute = new Date(d.time).getMinutes();
            return {
                key: d.time,
                startAngle: minutes.toRadians(minute),
                endAngle: minutes.toRadians(minute + 1),
                innerRadius: toRadius(d.precipIntensity),
                outerRadius: bounds.upper,
                probability: d.precipProbability,
                extreme: d.precipIntensity > maxExpectedPrecipIntensity,
            };
        });
};

/* probability drives how deep/saturated each bar's colour is; extreme-heavy bars are drawn
   from a different hue entirely so they read as unusual rather than merely "more of the same" */
const barColor = (d: Bar) => (d.extreme ? d3.interpolateReds(0.35 + d.probability * 0.65) : d3.interpolateBlues(0.15 + d.probability * 0.7));
const barStroke = (d: Bar) => (d.extreme ? 'firebrick' : 'steelblue');

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
    const bounds = useBarBounds();
    const forecast = useForecast();
    const bars = useBars(bounds);
    const toRadius = useIntensityScale(bounds);
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
                    .selectAll('g')
                    .data(RAIN_BANDS)
                    .enter()
                    .append('g')
                    .attr('class', d => 'axis ' + d.label.toLowerCase());
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

            // position bands to match the current intensity scale
            container
                .select('.axis-group')
                .selectAll<SVGGElement, (typeof RAIN_BANDS)[number]>('g')
                .each(function (d) {
                    const r = toRadius(d.value);
                    d3.select(this).select('circle').attr('r', r);
                    d3.select(this).select('text').attr('y', -r - 0.014);
                });
        },
        [bars, toRadius],
    );

    return <ClockFace ref={face} {...props} />;
};

WaterLevelFace.defaultProps = {
    id: 'water-level',
};

export default memo(WaterLevelFace);
