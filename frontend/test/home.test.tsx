import { render } from '@testing-library/react';
import Home from '../src/pages/home';
import '@testing-library/jest-dom';

describe('Home page', () => {
    it('should render', async () => {
        render(<Home />);
    });
});
