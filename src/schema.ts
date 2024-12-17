import { z } from 'zod'

export const errorMessages = {
  fixedAmountRequired: 'Amount is required',
  invalidType: 'Invalid type',
  minAmountRequired: 'Min Amount is required',
  maxAmountRequired: 'Max Amount is required',
  minLessThanMax: 'Min must be less than max',
  nan: 'Expected number, received nan',
  invalidEmail: 'Invalid email',
  invalidString: 'Expected string, received number',
  invalidNumber: 'Expected number, received string',
  min1Char: 'String must contain at least 1 character(s)',
  max10Char: 'String must contain at most 10 character(s)',
} as const

const numberRefine = (val: number) => {
  if (isNaN(val) || !val) {
    return false
  }
  return true
}

const priceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('fixed'),
    amount: z.coerce
      .number({
        required_error: errorMessages.fixedAmountRequired,
        invalid_type_error: errorMessages.invalidNumber,
      })
      .refine(numberRefine, errorMessages.nan),
  }),
  z.object({
    type: z.literal('range'),
    amount: z
      .object({
        min: z.coerce
          .number({
            required_error: errorMessages.minAmountRequired,
            invalid_type_error: errorMessages.nan,
          })
          .refine(numberRefine, errorMessages.nan),
        max: z.coerce
          .number({
            required_error: errorMessages.maxAmountRequired,
            invalid_type_error: errorMessages.nan,
          })
          .refine(numberRefine, errorMessages.nan),
      })
      .superRefine((data, ctx) => {
        if (data.min >= data.max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessages.minLessThanMax,
            path: ['min'],
          })
        }
      }),
  }),
])

export const formSchema = z.object({
  name: z
    .string({
      required_error: errorMessages.min1Char,
      invalid_type_error: errorMessages.invalidString,
    })
    .min(1, errorMessages.min1Char)
    .max(10, errorMessages.max10Char),
  email: z.string().email(errorMessages.invalidEmail),
  price: priceSchema.optional(),
})

export type FormSchema = z.infer<typeof formSchema>
