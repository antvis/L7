import { IButtonControlOption } from './buttonControl';
import Control from './control';

export { PopperControl };

export interface IPopperControlOption extends IButtonControlOption {
  popperPlacement: string;
}

export default abstract class PopperControl extends Control<
  IPopperControlOption
> {

}
