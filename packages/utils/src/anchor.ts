export enum anchorType {
  'CENTER' = 'center',
  'TOP' = 'top',
  'TOP-LEFT' = 'top-left',
  'TOP-RIGHT' = 'top-right',
  'BOTTOM' = 'bottom',
  'BOTTOM-LEFT' = 'bottom-left',
  'BOTTOM-RIGHT' = 'bottom-right',
  'LEFT' = 'left',
  'RIGHT' = 'right',
}

export const anchorTranslate: { [key: string]: string } = {
  center: 'translate(-50%,-50%)',
  top: 'translate(-50%,0)',
  'top-left': 'translate(0,0)',
  'top-right': 'translate(-100%,0)',
  bottom: 'translate(-50%,-100%)',
  'bottom-left': 'translate(0,-100%)',
  'bottom-right': 'translate(-100%,-100%)',
  left: 'translate(0,-50%)',
  right: 'translate(-100%,-50%)',
};

export function applyAnchorClass(
  element: HTMLElement,
  anchor: string,
  prefix: string,
) {
  const classList = element.classList;
  for (const key in anchorTranslate) {
    if (anchorTranslate.hasOwnProperty(key)) {
      classList.remove(`l7-${prefix}-anchor-${key}`);
    }
  }
  classList.add(`l7-${prefix}-anchor-${anchor}`);
}
