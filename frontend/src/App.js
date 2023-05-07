// import { Button } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Chats from './pages/Chats/Chats';
import Home from './pages/Home/Home';

function App() {
  return (
    <div className="App">
      <div id="header"></div>
     <Routes>
      <Route index element={<Home></Home>}></Route>
      <Route path='/chats' element={<Chats></Chats>}/>
      <Route path='/*' element={<h1>404 not found</h1>}/>
     </Routes>
    </div>
  );
}

export default App;
