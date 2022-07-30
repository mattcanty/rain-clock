import React, { memo } from 'react';
import { useD3 } from '../../utils/use-d3';
import ClockFace from '../ClockFace/ClockFace';
import * as d3 from 'd3';

type WaterLevelFaceProps = React.HTMLAttributes<HTMLDivElement> & {};

const DATA = [
    0.1, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0.1, 0.1, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.2, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.2, 0.2,
    0.2, 0, 0, 0, 0, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.2, 0, 0, 0, 0, 0.1, 0.1, 0.5, 0.5, 0.4, 0.4,
    0.2, 0, 0, 0, 0.1, 0.1,
].map<[number, number]>((radius, index, { length }) => [Math.PI * 2 * ((index + 1) / length - 1), 1 - radius]);

export const WaterLevelFace: React.FunctionComponent<WaterLevelFaceProps> = props => {
    const face = useD3(container => {
        const svg = container.append('svg').attr('viewBox', `0 0 2.2 2.2`).attr('preserveAspectRatio', 'xMidYMid meet');

        const radial = d3
            .areaRadial()
            .curve(d3.curveBasisClosed)
            .innerRadius(() => 1)(DATA);

        svg.append('g')
            .append('path')
            .attr('transform', 'translate(1.1,1.1)')
            .attr('d', radial)
            .attr('fill', 'lightsteelblue')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 0.01);
    }, []);

    return <ClockFace ref={face} {...props} />;
};

WaterLevelFace.defaultProps = {
    id: 'water-level',
};

export default memo(WaterLevelFace);
