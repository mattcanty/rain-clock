import * as d3 from 'd3';
import React, { memo } from 'react';

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

const usePath = () => {
    const forecast = useForecast();

    const data = forecast.map(d => [time.toRadians(d.time), 1 - d.precipIntensity] as const);
    const radial = d3
        .areaRadial<readonly [number, number]>()
        .curve(d3.curveBasis)
        .innerRadius(() => 1);

    return radial(data);
};

export const WaterLevelFace: React.FunctionComponent<WaterLevelFaceProps> = props => {
    const path = usePath();
    const face = useD3(
        container => {
            if (!container.select('path').node()) {
                const svg = container
                    .append('svg')
                    .attr('viewBox', `0 0 2.2 2.2`)
                    .attr('width', '100%')
                    .attr('height', 'auto')
                    .attr('preserveAspectRatio', 'xMidYMid meet');

                svg.append('g')
                    .append('path')
                    .attr('transform', 'translate(1.1,1.1)')
                    .attr('fill', 'lightsteelblue')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 0.01)
                    .attr('d', path);
            } else {
                container.select('path').transition().duration(400).attr('d', path);
            }
        },
        [path],
    );

    return <ClockFace ref={face} {...props} />;
};

WaterLevelFace.defaultProps = {
    id: 'water-level',
};

export default memo(WaterLevelFace);
