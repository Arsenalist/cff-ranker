import React from 'react';
import AgeCategoryList from './age-category-list';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';

const mock = new MockAdapter(require('axios'));
describe('AgeCategoryList', () => {
  beforeEach(() => {
    mock.reset()
    mock.onGet('/api/age-category').reply(200, [
      {
        name: 'Senior',
        code: 'senior',
        yearOfBirth: 2020
      },
      {
        name: 'Junior',
        code: 'junior',
        yearOfBirth: 2019
      }

    ]);
  })
  it('should show all age categories', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    expect(screen.getByText(/Senior/)).toBeInTheDocument();
    expect(screen.getByText(/senior/)).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/Junior/)).toBeInTheDocument();
    expect(screen.getByText(/junior/)).toBeInTheDocument();
    expect(screen.getByText(/2019/)).toBeInTheDocument();
  });
});
