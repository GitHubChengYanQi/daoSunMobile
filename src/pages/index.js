import Login from './Login';
import Home from './Home';


export default function() {


  return (
    <>
      {process.env.NODE_ENV === 'development' ? <Login /> :  <Home />}
    </>
  );
}
