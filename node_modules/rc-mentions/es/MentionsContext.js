/* tslint:disable: no-object-literal-type-assertion */
import createReactContext from '@ant-design/create-react-context'; // We will never use default, here only to fix TypeScript warning

var MentionsContext = createReactContext(null);
export var MentionsContextProvider = MentionsContext.Provider;
export var MentionsContextConsumer = MentionsContext.Consumer;