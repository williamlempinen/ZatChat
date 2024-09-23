import * as React from 'react'

export const useToggle = <T,>(initial: T, alternate: T) => {
  const [state, setState] = React.useState<T>(initial)

  const toggle = () => {
    setState((prev) => (prev === initial ? alternate : initial))
  }

  return { state, toggle }
}
