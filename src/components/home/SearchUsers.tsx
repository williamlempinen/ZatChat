import * as React from 'react'
import Input from '../ui/Input'

type SearchUsersProps = {
  query: string
}

const SearchUsers = ({ query }: SearchUsersProps) => {
  const deferredQ = React.useDeferredValue(query)

  return <div className="flex w-full">{deferredQ}</div>
}

export default SearchUsers
