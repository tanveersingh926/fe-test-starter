import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { formSchema } from './schema'

export default function App() {
  const formMethods = useForm({
    resolver: zodResolver(formSchema),
  })

  // The callback to use when the form is submitted
  const saveData = (data) => {
    console.log(data)
  }

  return <div className="App">Your UI code goes here</div>
}
