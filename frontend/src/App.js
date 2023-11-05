import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ChatBox from './components/ChatBox';


function App() {
  const router = createBrowserRouter([
    {
      path: '/', element: <ChatBox/>,
      errorElement: <h1>Oops! Error</h1>
    }
  ])

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
