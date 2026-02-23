import { Popper } from '../src/utils/popper';

describe('Popper', () => {
  let container: HTMLElement;
  let button: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.position = 'relative';
    document.body.appendChild(container);

    button = document.createElement('button');
    button.textContent = 'Test Button';
    container.appendChild(button);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should add to conflictPopperList when unique is true', () => {
    const popper = new Popper(button, {
      container,
      placement: 'bottom',
      trigger: 'click',
      unique: true,
    });

    expect(Popper['conflictPopperList']).toContain(popper);

    popper.destroy();
  });

  it('should remove from conflictPopperList on destroy', () => {
    const popper = new Popper(button, {
      container,
      placement: 'bottom',
      trigger: 'click',
      unique: true,
    });

    expect(Popper['conflictPopperList']).toContain(popper);

    popper.destroy();

    expect(Popper['conflictPopperList']).not.toContain(popper);
  });

  it('should not add to conflictPopperList when unique is false', () => {
    const popper = new Popper(button, {
      container,
      placement: 'bottom',
      trigger: 'click',
      unique: false,
    });

    expect(Popper['conflictPopperList']).not.toContain(popper);

    popper.destroy();
  });

  it('should hide other unique poppers when showing', () => {
    const popper1 = new Popper(button, {
      container,
      placement: 'bottom',
      trigger: 'click',
      unique: true,
      content: 'Content 1',
    });

    const button2 = document.createElement('button');
    container.appendChild(button2);

    const popper2 = new Popper(button2, {
      container,
      placement: 'bottom',
      trigger: 'click',
      unique: true,
      content: 'Content 2',
    });

    popper1.show();
    expect(popper1.getIsShow()).toBe(true);

    popper2.show();
    expect(popper2.getIsShow()).toBe(true);
    expect(popper1.getIsShow()).toBe(false);

    popper1.destroy();
    popper2.destroy();
  });

  it('should show and hide correctly', () => {
    const popper = new Popper(button, {
      container,
      placement: 'bottom',
      trigger: 'click',
      content: 'Test Content',
    });

    expect(popper.getIsShow()).toBe(false);

    popper.show();
    expect(popper.getIsShow()).toBe(true);

    popper.hide();
    expect(popper.getIsShow()).toBe(false);

    popper.destroy();
  });

  it('should set and get content correctly', () => {
    const popper = new Popper(button, {
      container,
      placement: 'bottom',
      trigger: 'click',
    });

    popper.setContent('New Content');
    expect(popper.getContent()).toBe('New Content');

    const divContent = document.createElement('div');
    divContent.textContent = 'Div Content';
    popper.setContent(divContent);
    expect(popper.getContent()).toBe(divContent);

    popper.destroy();
  });
});
