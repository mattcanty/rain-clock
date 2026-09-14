import * as d3 from 'd3';
import React, { memo, useMemo } from 'react';

import { getSimulatedData } from '../../utils/get-simulated-data';
import { useD3 } from '../../utils/use-d3';
import { useNow } from '../../utils/use-now';
import ClockFace from '../ClockFace/ClockFace';
import { useForecast } from '../ForecastProvider/ForecastProvider';

type WaterLevelFaceProps = React.HTMLAttributes<HTMLDivElement> & {};

const minutes = {
    toRadians: d3
        .scaleLinear()
        .domain([0, 60])
        .range([0, Math.PI * 2]),
};

const time = {
    toRadians: (input: number) => minutes.toRadians(new Date(input).getMinutes()),
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
        .range([1, 0])
        .domain([INTENSITY_FLOOR, Math.max(max, INTENSITY_FLOOR * 10)])
        .clamp(true);

const useIntensityScale = () => {
    const forecast = useForecast();

    const max = Math.max(maxExpectedPrecipIntensity, d3.max(forecast, d => d.precipIntensity) ?? 0);
    return useMemo(() => createIntensityScale(max), [max]);
};

/* re-checked this often so elapsed minutes drop off the ring as the clock hand passes them */
const PAST_CHECK_INTERVAL = 15 * 1000;

const usePath = () => {
    const forecast = useForecast();
    const toRadius = useIntensityScale();
    const now = useNow(PAST_CHECK_INTERVAL);

    const data = forecast
        .filter(d => d.time > now)
        .map(d => [time.toRadians(d.time), toRadius(d.precipIntensity)] as const);
    const radial = d3
        .areaRadial<readonly [number, number]>()
        .curve(d3.curveLinear)
        .innerRadius(() => 1);

    return radial(data);
};

const DATA_POINTS = getSimulatedData().map<[number, number]>((_, i, { length }) => [(2 * Math.PI * i) / length, 1]);
const INITIAL_PATH = d3.areaRadial().curve(d3.curveBasis).innerRadius(1)(DATA_POINTS);

export const WaterLevelFace: React.FunctionComponent<WaterLevelFaceProps> = props => {
    const forecast = useForecast();
    const data = usePath();
    const toRadius = useIntensityScale();
    const face = useD3(
        container => {
            if (!container.select('path').node()) {
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

                // draw initial path, just a circle, to enable initial transition
                const path = svg.append('g').append('path');
                path.attr('transform', 'translate(1.1,1.1)')
                    .attr('fill', 'lightsteelblue')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 0.01)
                    .attr('opacity', 0.8)
                    .attr('d', INITIAL_PATH);
            }

            // skip until the first forecast arrives (keeps the placeholder circle); after that, an
            // empty (all-past) forecast clears the shape instead of freezing on stale data
            if (forecast.length > 0) {
                container.select('path').transition().duration(400).attr('d', data ?? '');
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
        [data, toRadius],
    );

    return <ClockFace ref={face} {...props} />;
};

WaterLevelFace.defaultProps = {
    id: 'water-level',
};

export default memo(WaterLevelFace);
