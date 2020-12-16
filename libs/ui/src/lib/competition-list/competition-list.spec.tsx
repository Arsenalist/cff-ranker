import React from 'react';
import { render } from '@testing-library/react';

import CompetitionList from './competition-list';

describe('CompetitionList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CompetitionList />);
    expect(baseElement).toBeTruthy();
  });
});
