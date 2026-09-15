import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import * as ForecastProvider from '../ForecastProvider/ForecastProvider';
import LocationBox, { format, parse } from './LocationBox';

jest.mock('../ForecastProvider/ForecastProvider');

const mockedUseLocation = ForecastProvider.useLocation as jest.Mock;
const mockedUseAutoRefresh = ForecastProvider.useAutoRefresh as jest.Mock;

const LONDON = { latitude: 51.5074, longitude: -0.1278 };

// mirrors the shape of useLocation()'s controls, but with every callback typed as a jest.Mock
// (rather than production's plain `() => void`) so tests can assert on and reconfigure them
type MockedLocationControls = {
    setCoordinates: jest.Mock;
    clearOverride: jest.Mock;
    isOverridden: boolean;
    refreshNow: jest.Mock;
    requestPosition: jest.Mock;
    locationError: string | undefined;
};

// `position` has no default: an explicit `undefined` argument must actually mean "no position",
// not silently fall back to a default the way a JS default parameter would
const renderLocationBox = (overrides: Partial<MockedLocationControls>, position: typeof LONDON | undefined) => {
    const controls: MockedLocationControls = {
        setCoordinates: jest.fn(),
        clearOverride: jest.fn(),
        isOverridden: false,
        refreshNow: jest.fn(),
        requestPosition: jest.fn(),
        locationError: undefined,
        ...overrides,
    };
    const resumeAutoRefresh = jest.fn();

    mockedUseLocation.mockReturnValue([position, controls]);
    mockedUseAutoRefresh.mockReturnValue([true, resumeAutoRefresh]);

    render(<LocationBox />);

    return { controls, resumeAutoRefresh };
};

describe('format/parse', () => {
    it('formats coordinates as a comma-separated pair', () => {
        expect(format(LONDON)).toBe('51.5074,-0.1278');
    });

    it('formats an unknown position as an empty string', () => {
        expect(format(undefined)).toBe('');
    });

    it('parses a valid "lat,lon" pair, trimming whitespace', () => {
        expect(parse(' 54.6564 , -7.6880 ')).toEqual({ latitude: 54.6564, longitude: -7.688 });
    });

    it('rejects out-of-range latitude/longitude', () => {
        expect(parse('91,0')).toBeUndefined();
        expect(parse('0,181')).toBeUndefined();
    });

    it('rejects garbage input', () => {
        expect(parse('not a location')).toBeUndefined();
        expect(parse('')).toBeUndefined();
    });
});

describe('LocationBox', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows the current position formatted as latitude,longitude', () => {
        renderLocationBox({}, LONDON);

        expect(screen.getByRole('textbox')).toHaveValue('51.5074,-0.1278');
    });

    it('shows the position, not the location error, while a position is known', () => {
        renderLocationBox({ locationError: 'User denied Geolocation' }, LONDON);

        expect(screen.getByRole('textbox')).toHaveValue('51.5074,-0.1278');
    });

    it('surfaces the geolocation error as a placeholder once there is no position', () => {
        renderLocationBox({ locationError: 'User denied Geolocation' }, undefined);

        expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'User denied Geolocation');
    });

    it('pins a new override when a different location is entered', () => {
        const { controls, resumeAutoRefresh } = renderLocationBox({}, LONDON);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '54.6564,-7.6880' } });
        fireEvent.blur(input);

        expect(controls.setCoordinates).toHaveBeenCalledWith({ latitude: 54.6564, longitude: -7.688 });
        expect(resumeAutoRefresh).toHaveBeenCalled();
        expect(controls.refreshNow).not.toHaveBeenCalled();
    });

    it('treats Enter the same as blurring, to commit the value', () => {
        const { controls } = renderLocationBox({}, LONDON);

        const input = screen.getByRole('textbox');
        // the component's Enter handler calls the real .blur() DOM method, which jsdom only turns
        // into an actual blur event if the element is genuinely document.activeElement — a plain
        // fireEvent.focus() dispatches the event without updating that, so use the real method
        input.focus();
        fireEvent.change(input, { target: { value: '54.6564,-7.6880' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(controls.setCoordinates).toHaveBeenCalledWith({ latitude: 54.6564, longitude: -7.688 });
    });

    it('just refreshes, without pinning an override, when resubmitting the same position', () => {
        const { controls } = renderLocationBox({}, LONDON);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '51.5074,-0.1278' } });
        fireEvent.blur(input);

        expect(controls.setCoordinates).not.toHaveBeenCalled();
        expect(controls.refreshNow).toHaveBeenCalled();
    });

    it('reverts to the last known position when given unparseable input', () => {
        renderLocationBox({}, LONDON);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'nonsense' } });
        fireEvent.blur(input);

        expect(input).toHaveValue('51.5074,-0.1278');
    });

    it('clears the override, without forcing a refresh, when emptied while overridden', () => {
        const { controls } = renderLocationBox({ isOverridden: true }, LONDON);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        expect(controls.clearOverride).toHaveBeenCalled();
        expect(controls.refreshNow).not.toHaveBeenCalled();
    });

    it('forces a refresh when emptied but there was nothing to clear', () => {
        const { controls } = renderLocationBox({ isOverridden: false }, LONDON);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        expect(controls.clearOverride).toHaveBeenCalled();
        expect(controls.refreshNow).toHaveBeenCalled();
    });

    it('requests the device position once on mount', () => {
        const { controls } = renderLocationBox({}, LONDON);

        expect(controls.requestPosition).toHaveBeenCalledTimes(1);
    });

    it('only retries the device position once from focus, so paste is never interrupted', () => {
        const { controls } = renderLocationBox({}, undefined);
        controls.requestPosition.mockClear();

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.focus(input);

        expect(controls.requestPosition).toHaveBeenCalledTimes(1);
    });

    describe('reset button', () => {
        it('clears the override and re-requests the device position', () => {
            const { controls, resumeAutoRefresh } = renderLocationBox({ isOverridden: true }, LONDON);
            controls.requestPosition.mockClear();

            fireEvent.click(screen.getByRole('button', { name: 'Reset to detected location' }));

            expect(controls.clearOverride).toHaveBeenCalled();
            expect(controls.requestPosition).toHaveBeenCalledTimes(1);
            expect(resumeAutoRefresh).toHaveBeenCalled();
        });

        it('forces a refresh when there was no override to clear', () => {
            const { controls } = renderLocationBox({ isOverridden: false }, LONDON);

            fireEvent.click(screen.getByRole('button', { name: 'Reset to detected location' }));

            expect(controls.refreshNow).toHaveBeenCalled();
        });

        it("doesn't force a refresh when clearing an override, since that already triggers one", () => {
            const { controls } = renderLocationBox({ isOverridden: true }, LONDON);

            fireEvent.click(screen.getByRole('button', { name: 'Reset to detected location' }));

            expect(controls.refreshNow).not.toHaveBeenCalled();
        });
    });
});
