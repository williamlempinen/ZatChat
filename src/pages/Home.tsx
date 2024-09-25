import { nodeServerApi } from '../lib/api/nodeServerApi'

const Home = () => {
  const { testGetProtectedData } = nodeServerApi()

  const test = async () => {
    console.log('testing')
    const res = await testGetProtectedData()
    console.log('res: ', res)
  }

  return (
    <div className="bg-shl">
      <p>Hello world</p>Hello World
      <button onClick={test}>Test auth</button>
    </div>
  )
}

export default Home
