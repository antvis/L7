import { Modifier } from 'draft-js';
import customHTML2Content from './customHTML2Content';
export default function handlePastedText(text, html) {
    if (html) {
        var fragment = customHTML2Content(html);
        var withImage = Modifier.replaceWithFragment(imageBlock, insertionTarget, fragment);
    }
    return 'not-handled';
}