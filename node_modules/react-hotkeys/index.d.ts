import * as React from 'react';

export type MouseTrapKeySequence = string | Array<string>;

export type ActionName = string;

export type KeyEventName = 'keyup' | 'keydown' | 'keypress';

export interface KeyMapOptions {
  sequence: MouseTrapKeySequence;
  action: KeyEventName;
}

export type KeySequence = MouseTrapKeySequence | KeyMapOptions | Array<MouseTrapKeySequence> | Array<KeyMapOptions>;

export type KeyMap = { [key in ActionName]: KeySequence };

/**
 * Component that listens to key events when one of its children are in focus and
 * selectively triggers actions (that may be handled by handler functions) when a
 * sequence of events matches a list of pre-defined sequences or combinations
 */
export interface HotKeysEnabled extends React.Component<HotKeysProps, {}> { }

export interface GlobalHotKeysProps extends React.HTMLAttributes<HotKeys> {
  /**
   * A map from action names to Mousetrap or Browser key sequences
   */
  keyMap?: KeyMap;

  /**
   * A map from action names to event handler functions
   */
  handlers?: { [key: string]: (keyEvent?: KeyboardEvent) => void };

  /**
   * Whether the keyMap or handlers are permitted to change after the
   * component mounts. If false, changes to the keyMap and handlers
   * props will be ignored
   */
  allowChanges?: boolean;
}

export interface HotKeysEnabledProps extends GlobalHotKeysProps {
  /**
   * Function to call when this component gains focus in the browser
   */
  onFocus?: () => void;

  /**
   * Function to call when this component loses focus in the browser
   */
  onBlur?: () => void;
}

export interface HotKeysProps extends HotKeysEnabledProps {
  /**
   * The React component that should be used in the DOM to wrap the FocusTrap's
   * children and have the internal key listeners bound to
   */
  component?: React.ComponentClass | string;

  innerRef?: React.RefObject<HTMLInputElement>;
}

/**
 * @see HotKeysEnabled
 */
export class HotKeys extends React.Component<HotKeysProps, {}> { }

export class GlobalHotKeys extends React.Component<GlobalHotKeysProps, {}> { }

/**
 * Wraps a React component in a HotKeysEnabled component, which passes down the
 * callbacks and options necessary for React Hotkeys to work as a single prop value,
 * hotkeys. These must be unwrapped and applied to a DOM-mountable element within
 * the wrapped component (e.g. div, span, input, etc) in order for the key events
 * to be recorded.
 */
export declare function withHotKeys(Component: React.ComponentClass, hotKeysOptions: HotKeysEnabledProps): HotKeysEnabled;

export declare function deprecatedWithHotKeys(keyMap: { [key: string]: KeySequence }): HotKeys;

export type ListOfKeys = string | Array<string>;

/**
 * A component that causes React Hotkeys to ignore the results of
 * Configuration.ignoreEventCondition and instead either force the event to be
 * ignored or observed. By default, this is all key events, but you can use
 * the only prop to provide a whitelist, or the except prop to pass a blacklist.
 */
export interface HotKeysIgnoreOverride extends React.Component<HotKeysProps, {}> { }

export interface HotKeysOverrideProps extends React.HTMLAttributes<HotKeys> {
  /**
   * The whitelist of keys that keyevents should be ignored. i.e. if you place
   * a key in this list, all events related to it will be ignored by react hotkeys
   */
  only: ListOfKeys,

  /**
   * The blacklist of keys that keyevents should be not ignored. i.e. if you place
   * a key in this list, all events related to it will be still be observed by react
   * hotkeys
   */
  except: ListOfKeys
}

/**
 * A component that causes React Hotkeys to ignore all matching key events
 * triggered by its children. By default, this is all key events, but you can use
 * the only prop to provide a whitelist, or the except prop to pass a blacklist (and
 * cause HotKeys components to still observe these events).
 *
 * @see HotKeysIgnoreOverride
 */
export class IgnoreKeys extends React.Component<HotKeysOverrideProps, {}> { }

export class ObserveKeys extends React.Component<HotKeysOverrideProps, {}> { }

/**
 * Wraps a React component in a HotKeysIgnored component, which passes down the
 * callbacks and options necessary for React Hotkeys to work as a single prop value,
 * hotkeys. These must be unwrapped and applied to a DOM-mountable element within
 * the wrapped component (e.g. div, span, input, etc) in order for the key events
 * to be recorded.
 */
export declare function withHotKeysIgnore(Component: React.ComponentClass, hotKeysIgnoreOptions: HotKeysOverrideProps): IgnoreKeys;

export type ApplicationKeyMap = { [key in ActionName]: Array<MouseTrapKeySequence> };

/**
 * Generates and returns the application's key map, including not only those
 * that are live in the current focus, but all the key maps from all the
 * HotKeys and GlobalHotKeys components that are currently mounted
 */
export declare function getApplicationKeyMap(): ApplicationKeyMap;
