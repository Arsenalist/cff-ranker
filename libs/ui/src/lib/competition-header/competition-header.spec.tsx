import React from 'react';
import { render } from '@testing-library/react';

import CompetitionHeader from './competition-header';

describe('CompetitionHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CompetitionHeader />);
    expect(baseElement).toBeTruthy();
  });
});
