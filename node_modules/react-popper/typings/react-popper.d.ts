import * as React from "react";
import * as PopperJS from "popper.js";

interface ManagerProps {
  children: React.ReactNode;
}
export class Manager extends React.Component<ManagerProps, {}> { }

interface ReferenceChildrenProps {
  // React refs are supposed to be contravariant (allows a more general type to be passed rather than a more specific one)
  // However, Typescript currently can't infer that fact for refs
  // See https://github.com/microsoft/TypeScript/issues/30748 for more information
  ref: React.Ref<any>;
}

interface ReferenceProps {
  children: (props: ReferenceChildrenProps) => React.ReactNode;
  innerRef?: React.Ref<any>;
}
export class Reference extends React.Component<ReferenceProps, {}> { }

export interface PopperArrowProps {
  ref: React.Ref<any>;
  style: React.CSSProperties;
}

export interface PopperChildrenProps {
  arrowProps: PopperArrowProps;
  outOfBoundaries: boolean | null;
  placement: PopperJS.Placement;
  ref: React.Ref<any>;
  scheduleUpdate: () => void;
  style: React.CSSProperties;
}

export interface PopperProps {
  children: (props: PopperChildrenProps) => React.ReactNode;
  eventsEnabled?: boolean;
  innerRef?: React.Ref<any>;
  modifiers?: PopperJS.Modifiers;
  placement?: PopperJS.Placement;
  positionFixed?: boolean;
  referenceElement?: PopperJS.ReferenceObject;
}
export class Popper extends React.Component<PopperProps, {}> { }
