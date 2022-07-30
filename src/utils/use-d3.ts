import { DependencyList, useEffect, useRef } from 'react';

import * as d3 from 'd3';

type D3Selection = d3.Selection<any, unknown, any, unknown>; // FIXME: don't use any
type D3Render = (container: D3Selection) => void;
export const useD3 = (render: D3Render, dependencies: DependencyList) => {
    const ref = useRef(null);

    useEffect(() => {
        render(d3.select(ref.current));
    }, dependencies);

    return ref;
};
