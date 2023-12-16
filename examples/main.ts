import DemoList from './demos';
const select = document.createElement('select');
select.id = 'example-select';
select.style.margin = '1em';
select.style.position = 'absolute',
select.style.top ='10px'
select.style.zIndex ='2'
select.onchange = onChange;
select.style.display = 'block';
document.body.append(select);

const options = Object.keys(demos).map((d) => {
  const option = document.createElement('option');
  option.textContent = d;
  option.value = d;
  return option;
});
options.forEach((d) => select.append(d));


const initialValue = new URL(location as any).searchParams.get(
  'name',
) as string;
if (demos[initialValue]) select.value = initialValue;

const $container = document.getElementById('map')!;

let callback: () => void;
render();

async function render() {
  if (callback) {
    callback();
  }
  $container.innerHTML = '';

  const demo = demos[select.value];
  demo();
  // callback = await initExample($container, demo);

  // @ts-ignore
  if (window.screenshot) {
    // @ts-ignore
    await window.screenshot();
  }
}

function onChange() {
  const { value } = select;
  history.pushState({ value }, '', `?name=${value}`);

  render()
}