import * as d3 from 'd3';
import React, { memo, useMemo } from 'react';

import { getSimulatedData } from '../../utils/get-simulated-data';
import { useD3 } from '../../utils/use-d3';
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

const useIntensityScale = () => {
    const forecast = useForecast();

    const maxExpectedPrecipIntensity = 0.4

    const max = Math.max(maxExpectedPrecipIntensity, d3.max(forecast, d => d.precipIntensity) ?? 0);
    return useMemo(
        () =>
            d3
                .scaleLinear()
                .range([1, 0])
                .domain([0, Math.max(maxExpectedPrecipIntensity, max)]),
        [max],
    );
};

const usePath = () => {
    const forecast = useForecast();
    const toRadius = useIntensityScale();

    const data = forecast.map(d => [time.toRadians(d.time), toRadius(d.precipIntensity)] as const);
    const radial = d3
        .areaRadial<readonly [number, number]>()
        .curve(d3.curveNatural)
        .innerRadius(() => 1);

    return radial(data);
};

const AXIS_COUNT = 10;

const DATA_POINTS = getSimulatedData().map<[number, number]>((_, i, { length }) => [(2 * Math.PI * i) / length, 1]);
const INITIAL_PATH = d3.areaRadial().curve(d3.curveBasis).innerRadius(1)(DATA_POINTS);

export const WaterLevelFace: React.FunctionComponent<WaterLevelFaceProps> = props => {
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

                // draw axis
                const axes = svg
                    .append('g')
                    .attr('transform', 'translate(1.1,1.1)')
                    .attr('class', 'axis')
                    .selectAll('g')
                    .data(Array.from({ length: AXIS_COUNT }).map((_, i) => i))
                    .enter();
                const axis = axes.append('g');
                axis.append('circle').attr('r', (_, i, { length }) => i / length);
                axis.append('text')
                    .attr('x', 0)
                    .attr('y', (_, i, { length }) => -i / length - 0.01)
                    .attr('font-size', 0.025)
                    .attr('color', 'black');

                // draw initial path, just a circle, to enable initial transition
                const path = svg.append('g').append('path');
                path.attr('transform', 'translate(1.1,1.1)')
                    .attr('fill', 'lightsteelblue')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 0.01)
                    .attr('opacity', 0.8)
                    .attr('d', INITIAL_PATH);
            }

            // transition on data change
            if (data) {
                container.select('path').transition().duration(400).attr('d', data);
            }

            // label axis
            container
                .select('.axis')
                .selectAll('text')
                .text((_, i, { length }) => parseFloat(toRadius.invert(i / length).toFixed(2)));
        },
        [data, toRadius],
    );

    return <ClockFace ref={face} {...props} />;
};

WaterLevelFace.defaultProps = {
    id: 'water-level',
};

export default memo(WaterLevelFace);
