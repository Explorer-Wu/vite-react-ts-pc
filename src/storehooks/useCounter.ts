import { useCallback, useState } from 'react'

export const useCounter = (initVal: number = 0) => {
  const [count, setCount] = useState(initVal)
  const increment = useCallback(() => setCount(x => x + 1), [])
  return { count, increment }
}