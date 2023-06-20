import * as d3 from 'd3';
import { DependencyList, useEffect, useRef } from 'react';

export type D3Selection = d3.Selection<any, unknown, any, unknown>; // FIXME: don't use any
export type D3Render = (container: D3Selection) => void;
export const useD3 = (render: D3Render, dependencies: DependencyList) => {
    const ref = useRef(null);

    useEffect(() => {
        render(d3.select(ref.current));
    }, dependencies);

    return ref;
};
