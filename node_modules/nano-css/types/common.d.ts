import * as CSS from 'csstype';
import {Atoms} from '../addon/atoms';

interface CssProps extends CSS.Properties, CSS.PropertiesHyphen, Atoms {}

interface CssLikeObject extends CssProps {
    [selector: string]: any | CssLikeObject;
}

type TDynamicCss = (css: CssLikeObject) => string;
type THyperstyleElement = object;
type THyperstyle = (...args) => THyperstyleElement;
type THyperscriptType = string | Function;
type THyperscriptComponent = Function;
