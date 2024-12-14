import * as React from 'react'
import Input from '../ui/Input'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import { useQuery } from '@tanstack/react-query'
import { User } from '../../types/types'
import UserCard from './UserCard'
import ErrorTypography from '../ui/ErrorTypography'
import Loading from '../ui/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const SearchUsers = () => {
  const [query, setQuery] = React.useState<string>('')

  const debouncedQuery = useDebounce(query, 300)

  const { searchUsers } = nodeServerApi()

  const handleSearch = async () => {
    const response = await searchUsers(debouncedQuery)
    return response.data.data as User[]
  }

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search-users', debouncedQuery],
    queryFn: handleSearch,
    enabled: debouncedQuery.length >= 2,
  })

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setQuery(value)
  }

  return (
    <div className="flex w-full flex-col">
      <Input
        type="text"
        name="search"
        value={query}
        placeholder="Search by username"
        onChange={handleQueryChange}
      />
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
