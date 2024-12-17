import { render, screen, userEvent } from './test-setup/test-utils.tsx'
export * from '@testing-library/react'

import { Form } from './Form'
import { errorMessages } from './schema'

test('Has basic fields', () => {
  render(<Form />)

  // Test that the basic inputs and submit button exist
  expect(screen.getByTestId('name')).toBeInTheDocument()
  expect(screen.getByTestId('email')).toBeInTheDocument()
  expect(screen.getByTestId('submit-button')).toBeInTheDocument()
})

test('Has fields that are shown conditionally', async () => {
  render(<Form />)

  // There are two radio buttons to show the price types
  expect(screen.getAllByRole('radio')).toHaveLength(2)

  // Test that the fixed amount input is shown when the fixed type is selected
  await userEvent.click(screen.getByTestId('fixed-type'))
  expect(screen.getByTestId('fixed-amount')).toBeInTheDocument()

  /* Test that the fixed amount input is hidden when the fixed type is selected,
   * and the min and max inputs are shown instead */
  await userEvent.click(screen.getByTestId('range-type'))
  expect(screen.queryByTestId('fixed-amount')).not.toBeInTheDocument()
  expect(screen.getByTestId('min-amount')).toBeInTheDocument()
  expect(screen.getByTestId('max-amount')).toBeInTheDocument()
})

test('Has displayed error messages on submit without values', async () => {
  render(<Form />)

  userEvent.click(screen.getByTestId('range-type'))

  await userEvent.click(screen.getByTestId('submit-button'))

  expect(screen.getByText(errorMessages.min1Char)).toBeInTheDocument()
  expect(screen.getByText(errorMessages.invalidEmail)).toBeInTheDocument()

  screen.queryAllByText(errorMessages.nan).forEach((el) => {
    expect(el).toBeInTheDocument()
  })
})

test('Has displayed error messages on submit with wrong values', async () => {
  render(<Form />)

  await userEvent.type(screen.getByTestId('name'), 'Batman Singh')
  await userEvent.type(screen.getByTestId('email'), 'batman.singhcave.com')

  await userEvent.click(screen.getByTestId('submit-button'))

  expect(screen.getByText(errorMessages.max10Char)).toBeInTheDocument()
  expect(screen.queryByText(errorMessages.invalidEmail)).toBeInTheDocument()
})

test('Has submit successfully with valid data', async () => {
  render(<Form />)

  userEvent.click(screen.getByTestId('fixed-type'))

  await userEvent.type(screen.getByTestId('name'), 'Batman')
  await userEvent.type(screen.getByTestId('email'), 'batman.singh@cave.com')
  await userEvent.type(screen.getByTestId('fixed-amount'), '100')

  await userEvent.click(screen.getByTestId('submit-button'))

  expect(screen.queryByText('Form Submitted')).toBeInTheDocument()
  expect(screen.queryByText(errorMessages.max10Char)).not.toBeInTheDocument()
  expect(screen.queryByText(errorMessages.invalidEmail)).not.toBeInTheDocument()
  expect(
    screen.queryByText(errorMessages.fixedAmountRequired)
  ).not.toBeInTheDocument()
})
