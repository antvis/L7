// export this package's api
import { ContentState } from 'draft-js';
import Mention from './component/Mention.react';
import toString from './utils/exportContent';
import getMentions from './utils/getMentions';
import Nav from './component/Nav.react';

function toEditorState(text) {
  return ContentState.createFromText(text);
}

Mention.Nav = Nav;
Mention.toString = toString;
Mention.toEditorState = toEditorState;
Mention.getMentions = getMentions;

export { Nav, toString, toEditorState, getMentions };

export default Mention;