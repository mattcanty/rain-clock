import { act, renderHook } from '@testing-library/react';

import { useHashRoute } from './use-hash-route';

describe('useHashRoute', () => {
    afterEach(() => {
        window.location.hash = '';
    });

    it('reads the current hash on mount, with the leading # stripped', () => {
        window.location.hash = '#about';

        const { result } = renderHook(() => useHashRoute());

        expect(result.current).toBe('about');
    });

    it('reports an empty route when there is no hash', () => {
        const { result } = renderHook(() => useHashRoute());

        expect(result.current).toBe('');
    });

    it('updates when the hash changes', () => {
        const { result } = renderHook(() => useHashRoute());

        expect(result.current).toBe('');

        act(() => {
            window.location.hash = '#about';
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });

        expect(result.current).toBe('about');
    });
});
