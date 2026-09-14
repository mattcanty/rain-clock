import { act, renderHook } from '@testing-library/react';

import { usePosition } from './use-position';

const mockGeolocation = {
    watchPosition: jest.fn(),
    getCurrentPosition: jest.fn(),
    clearWatch: jest.fn(),
};

const fakePosition = (latitude: number, longitude: number): GeolocationPosition =>
    ({ coords: { latitude, longitude } }) as GeolocationPosition;

beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
    });
});

describe('usePosition', () => {
    it('starts watching the device location on mount', () => {
        renderHook(() => usePosition());

        expect(mockGeolocation.watchPosition).toHaveBeenCalledTimes(1);
    });

    it('reports no position until the device reports one', () => {
        const { result } = renderHook(() => usePosition());

        expect(result.current[0]).toBeUndefined();
    });

    it('picks up the detected position once watchPosition succeeds', () => {
        const { result } = renderHook(() => usePosition());
        const onChange = mockGeolocation.watchPosition.mock.calls[0][0];

        act(() => onChange(fakePosition(51.5074, -0.1278)));

        expect(result.current[0]).toEqual({ latitude: 51.5074, longitude: -0.1278 });
    });

    it('lets a manual override take priority over the detected position', () => {
        const { result } = renderHook(() => usePosition());
        const onChange = mockGeolocation.watchPosition.mock.calls[0][0];
        act(() => onChange(fakePosition(51.5074, -0.1278)));

        act(() => result.current[1].setCoordinates({ latitude: 54.6564, longitude: -7.688 }));

        expect(result.current[0]).toEqual({ latitude: 54.6564, longitude: -7.688 });
        expect(result.current[1].isOverridden).toBe(true);
    });

    it('falls back to the detected position once the override is cleared', () => {
        const { result } = renderHook(() => usePosition());
        const onChange = mockGeolocation.watchPosition.mock.calls[0][0];
        act(() => onChange(fakePosition(51.5074, -0.1278)));
        act(() => result.current[1].setCoordinates({ latitude: 54.6564, longitude: -7.688 }));

        act(() => result.current[1].clearOverride());

        expect(result.current[0]).toEqual({ latitude: 51.5074, longitude: -0.1278 });
        expect(result.current[1].isOverridden).toBe(false);
    });

    it('requestPosition makes a one-off request for the current position', () => {
        const { result } = renderHook(() => usePosition());

        act(() => result.current[1].requestPosition());

        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });

    it('surfaces a geolocation error message', () => {
        const { result } = renderHook(() => usePosition());
        const onError = mockGeolocation.watchPosition.mock.calls[0][1];

        act(() => onError({ message: 'User denied Geolocation' } as GeolocationPositionError));

        expect(result.current[1].error).toBe('User denied Geolocation');
    });

    it('stops watching on unmount', () => {
        const { unmount } = renderHook(() => usePosition());

        unmount();

        expect(mockGeolocation.clearWatch).toHaveBeenCalledTimes(1);
    });
});
