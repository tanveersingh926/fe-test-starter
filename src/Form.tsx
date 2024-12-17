import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Container,
  Flex,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Heading,
  useToast,
} from '@chakra-ui/react'

import { FormSchema, formSchema } from './schema'
import { InputField } from './components/InputField'
import { AmountField } from './components/AmountField'

export const Form = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      price: {
        type: 'fixed',
        amount: undefined,
      },
    },
  })
  const toast = useToast()

  const priceType = watch('price.type')

  const fixedAmountErrorMessage = errors.price?.amount?.message
  const minAmountErrorMessage =
    errors.price?.amount && 'min' in errors.price.amount
      ? errors.price?.amount?.min?.message
      : undefined
  const maxAmountErrorMessage =
    errors.price?.amount && 'min' in errors.price.amount
      ? errors.price?.amount?.max?.message
      : undefined

  // The callback to use when the form is submitted
  const saveData = (data: FormSchema) => {
    // leaving the console.log because for the reviewer to verify the data
    console.log(data)

    toast({
      title: 'Form Submitted',
      description: "Awesome, you've successfully submitted the form.",
      position: 'top',
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  return (
    <Container pt={5}>
      <main className="Form">
        <Heading as="h1" size="lg" mb={5}>
          Frontend Test
        </Heading>
        <form onSubmit={handleSubmit(saveData)} noValidate>
          <InputField
            name="name"
            label="Name"
            type="text"
            register={register}
            errorMessage={errors.name?.message}
          />
          <InputField
            name="email"
            label="Email"
            type="email"
            register={register}
            errorMessage={errors.email?.message}
          />

          <Controller
            name="price.type"
            control={control}
            defaultValue={'fixed'}
            render={({ field }) => (
              <>
                <RadioGroup
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    resetField('price.amount', { defaultValue: undefined })
                  }}
                >
                  <FormLabel>Price Type</FormLabel>
                  <Stack direction="row">
                    <Radio value="fixed" data-testid={'fixed-type'}>
                      Fixed
                    </Radio>
                    <Radio value="range" data-testid={'range-type'}>
                      Range
                    </Radio>
                  </Stack>
                </RadioGroup>
              </>
            )}
          />
          <Flex gap="4" my={2}>
            {priceType === 'fixed' ? (
              <AmountField
                name="price.amount"
                label="Amount"
                register={register}
                errorMessage={fixedAmountErrorMessage}
                testId={'fixed-amount'}
              />
            ) : (
              <>
                <AmountField
                  name="price.amount.min"
                  label="Min Amount"
                  register={register}
                  errorMessage={minAmountErrorMessage}
                  testId={'min-amount'}
                />
                <AmountField
                  name="price.amount.max"
                  label="Max Amount"
                  register={register}
                  errorMessage={maxAmountErrorMessage}
                  testId={'max-amount'}
                />
              </>
            )}
          </Flex>

          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            data-testid={'submit-button'}
          >
            Submit
          </Button>
        </form>
      </main>
    </Container>
  )
}
