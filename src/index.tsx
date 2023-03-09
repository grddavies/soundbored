/* @refresh reload */
import './index.css';

import { render } from 'solid-js/web';
import { App } from 'src/components';

render(() => <App />, document.getElementById('root') as HTMLElement);
