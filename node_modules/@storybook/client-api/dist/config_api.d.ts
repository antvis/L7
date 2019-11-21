/// <reference types="node" />
/// <reference types="webpack-env" />
import Channel from '@storybook/channels';
import StoryStore from './story_store';
import ClientApi from './client_api';
export default class ConfigApi {
    _channel: Channel;
    _storyStore: StoryStore;
    _clearDecorators: () => void;
    clientApi: ClientApi;
    constructor({ channel, storyStore, clientApi, clearDecorators, }: {
        channel: Channel | null;
        storyStore: StoryStore;
        clientApi: ClientApi;
        clearDecorators: () => void;
    });
    _renderMain(): void;
    _renderError(err: Error): void;
    configure: (loaders: () => void, module: NodeModule) => void;
}
