import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './src/App';

const element = document.getElementById('root');
if (!element) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(element);

/*
 *  don't use React.StrictMode in __DEV__ as it renders the clock twice (once to check the render)
 *
 * root.render(
 *     <React.StrictMode>
 *         <App />
 *     </React.StrictMode>,
 * );
 *
 *  reference: https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode/61897567#61897567
 */
root.render(<App />);
