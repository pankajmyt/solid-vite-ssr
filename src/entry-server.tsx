import { renderToStringAsync } from 'solid-js/web';

import App from './App';

export function render(url: string, context: any) {
    return renderToStringAsync(() => <App />);
}