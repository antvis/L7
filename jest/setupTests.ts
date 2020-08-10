import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });
