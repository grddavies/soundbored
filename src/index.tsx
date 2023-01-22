/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { App } from 'src/components';

render(() => <App />, document.getElementById('root') as HTMLElement);
