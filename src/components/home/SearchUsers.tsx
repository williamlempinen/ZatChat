import * as React from 'react'
import Input from '../ui/Input'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../lib/AuthContext'
import { User } from '../../types/types'
import UserCard from './UserCard'
import ErrorTypography from '../ui/ErrorTypography'
import Loading from '../ui/Loading'

const SearchUsers = () => {
  const [query, setQuery] = React.useState<string>('')

  const deferredQ = React.useDeferredValue(query)

  const { user } = useAuth()

  const { searchUsers } = nodeServerApi()

  const handleSearch = async () => {
    const response = await searchUsers(deferredQ)
    return response.data.data as User[]
  }

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search-users', deferredQ],
    queryFn: handleSearch,
    enabled: deferredQ.length >= 2,
  })

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    console.log('VAL: ', value)
    console.log('DEFF: ', deferredQ)

    setQuery(value)
  }

  return (
    <div className="flex w-full flex-col rounded bg-base-light p-2">
      <Input
        type="text"
        name="search"
        value={query}
        placeholder="Search by username"
        onChange={handleQueryChange}
      />
      <p>Results: </p>
      {isError && <ErrorTypography />}
      {isLoading && <Loading />}
      {!isError && !isLoading && (
        <div className="flex w-full flex-col">
          {results?.length === 0 && <p className="self-center text-shl">No results found :(</p>}
          {results?.map((user) => <UserCard key={user.id} searchedUser={user} />)}
        </div>
      )}
    </div>
  )
}

export default SearchUsers
