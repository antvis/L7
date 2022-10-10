import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';
import 'jest-canvas-mock';

// @ts-igore
window.URL.createObjectURL = function() {};
Enzyme.configure({ adapter: new Adapter() });
