import React from 'react';
import { render } from '@testing-library/react';

import UploadCompetitionResults from './upload-competition-results';

describe('UploadCompetitionResults', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UploadCompetitionResults />);
    expect(baseElement).toBeTruthy();
  });
});
