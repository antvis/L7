import { ReactElement } from 'react';
import { Channel } from '@storybook/channels';
import { API } from './index';
import Store from './store';
export interface Provider {
    channel?: Channel;
    renderPreview?: () => ReactElement;
    handleAPI(api: API): void;
    [key: string]: any;
}
export interface SubAPI {
    renderPreview?: Provider['renderPreview'];
}
declare const _default: ({ provider, api }: {
    provider: Provider;
    api: API;
    store: Store;
}) => API;
export default _default;
