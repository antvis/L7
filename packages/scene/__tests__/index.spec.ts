describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  el.innerHTML = 'hello L7';
  document.querySelector('body').appendChild(el);

  it('div content', () => {
    expect(document.querySelector('#test-div-id').innerHTML).toBe('hello L7');
  });
});
