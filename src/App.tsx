
import { Provider } from 'react-redux'
import { Navbar } from "./Components/Navbar";
import store from './logic/redux/store';

export const App = () => {
  return (
    <>
        <Provider store={store}>
          <Navbar />
      </Provider>
    </>
  );
};
