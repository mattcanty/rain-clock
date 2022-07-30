import * as d3 from 'd3';
import React, { memo, useCallback } from 'react';
import useInterval from 'use-interval';

import { useD3 } from '../../utils/use-d3';
import ClockFace from '../ClockFace/ClockFace';

type AnalogFaceProps = React.HTMLAttributes<HTMLDivElement> & {
    margin: number;
};

const HOUR_SCALE = d3.scaleLinear().range([0, 330]).domain([0, 11]);
const MINUTE_SCALE = d3.scaleLinear().range([0, 354]).domain([0, 59]);
const SECOND_SCALE = d3.scaleLinear().range([0, 354]).domain([0, 59]);

const AnalogFace: React.FunctionComponent<AnalogFaceProps> = props => {
    const radius = 1;
    const margin = props.margin;
    const width = (radius + margin) * 2;
    const height = (radius + margin) * 2;
    const hourHandLength = (2 * radius) / 3;
    const minuteHandLength = radius * 0.82;
    const secondHandLength = radius * 0.76;
    const secondHandBalance = radius * 0.3;
    const secondTickStart = radius;
    const secondTickLength = radius * 0.01;
    const hourTickStart = radius;
    const hourTickLength = radius * 0.1;

    const HANDS = [
        {
            type: 'hour' as const,
            length: -hourHandLength,
            scale: HOUR_SCALE,
        },
        {
            type: 'minute' as const,
            length: -minuteHandLength,
            scale: MINUTE_SCALE,
        },
        {
            type: 'second' as const,
            length: -secondHandLength,
            scale: SECOND_SCALE,
            balance: secondHandBalance,
        },
    ];

    const tick = useCallback(() => {
        const date = new Date();
        d3.select('#clock-hands')
            .selectAll('line')
            .data(HANDS)
            .transition()
            .attr('transform', function (d) {
                switch (d.type) {
                    case 'hour':
                        return 'rotate(' + d.scale((date.getHours() % 12) + date.getMinutes() / 60) + ')';
                    case 'minute':
                        return 'rotate(' + d.scale(date.getMinutes()) + ')';
                    case 'second':
                        return 'rotate(' + d.scale(date.getSeconds()) + ')';
                }
            });
    }, [HANDS]);

    const clock = useD3(container => {
        const svg = container
            .append('svg')
            .attr('viewBox', `0 0 ${height} ${width}`)
            .attr('width', '100%')
            .attr('height', 'auto')
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const face = svg
            .append('g')
            .attr('id', 'clock-face')
            .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
            .style('overflow', 'overlay');

        face.selectAll('.second-tick')
            .data(d3.range(0, 60))
            .enter()
            .append('line')
            .attr('class', 'second-tick')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', secondTickStart)
            .attr('y2', secondTickStart + secondTickLength)
            .attr('transform', d => 'rotate(' + SECOND_SCALE(d) + ')');

        face.selectAll('.hour-tick')
            .data(d3.range(0, 12))
            .enter()
            .append('line')
            .attr('class', 'hour-tick')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', hourTickStart)
            .attr('y2', hourTickStart + hourTickLength)
            .attr('transform', d => 'rotate(' + HOUR_SCALE(d) + ')');

        const hands = face.append('g').attr('id', 'clock-hands');

        face.append('g')
            .attr('id', 'face-overlay')
            .append('circle')
            .attr('class', 'hands-cover')
            .attr('x', 0)
            .attr('y', 0)
            .attr('r', radius / 20);

        hands
            .selectAll('line')
            .data(HANDS)
            .enter()
            .append('line')
            .attr('class', d => d.type + '-hand')
            .attr('x1', 0)
            .attr('y1', d => (d.balance ? d.balance : 0))
            .attr('x2', 0)
            .attr('y2', d => d.length);

        tick();
    }, []);

    useInterval(tick, 1000);

    return <ClockFace ref={clock} {...props} />;
};

AnalogFace.defaultProps = { id: 'analog-face' };

export default memo(AnalogFace);
