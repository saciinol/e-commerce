import { useAuthenticated } from "../store/auth.store";

const Home = () => {
  const isAuthenticated = useAuthenticated();

  return (
    <div>
      Home
      {isAuthenticated && 'User'}
    </div>
  )
}

export default Home;
