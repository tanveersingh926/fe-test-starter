import { FieldPath, UseFormRegister } from 'react-hook-form'
import { FormSchema } from '../schema'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VisuallyHidden,
} from '@chakra-ui/react'

interface InputFieldProps {
  name: FieldPath<FormSchema>
  label: string
  type?: string
  register: UseFormRegister<FormSchema>
  errorMessage?: string
}

export const InputField = ({
  name,
  label,
  type = 'text',
  register,
  errorMessage,
}: InputFieldProps) => {
  const formLabel = <FormLabel>{label}</FormLabel>
  return (
    <FormControl isInvalid={Boolean(errorMessage)} mb={4}>
      {label ? formLabel : <VisuallyHidden>{formLabel}</VisuallyHidden>}
      <Input type={type} {...register(name)} data-testid={name} />
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  )
}
