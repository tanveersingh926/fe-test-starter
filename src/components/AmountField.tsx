import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  VisuallyHidden,
} from '@chakra-ui/react'
import { FieldPath, UseFormRegister } from 'react-hook-form'
import { FormSchema } from '../schema'

interface AmountFieldProps {
  name: FieldPath<FormSchema>
  label: string
  type?: string
  register: UseFormRegister<FormSchema>
  errorMessage?: string
  testId?: string
}

export const AmountField = ({
  errorMessage,
  register,
  name,
  type = 'text',
  label,
  testId,
}: AmountFieldProps) => {
  return (
    <FormControl isInvalid={Boolean(errorMessage)} my={4} as="fieldset">
      <VisuallyHidden>
        <FormLabel>{label}</FormLabel>
      </VisuallyHidden>
      <InputGroup>
        <InputLeftAddon>$</InputLeftAddon>
        <Input
          type={type}
          {...(testId && { ['data-testid']: testId })}
          {...register(name)}
        />
      </InputGroup>
      {Boolean(errorMessage) && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}
