import ReactDOM from 'react-dom';
import {HashRouter, Route, Routes} from "react-router-dom";
import CalculationsPage from './Calculations'; 
import CalculationsDetailedPage from './CalculationsDetailed'; 

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/calculations/" element={<CalculationsPage />}/>
      <Route path="/calculations/:id/" element={<CalculationsDetailedPage />}/>
    </Routes>
  </HashRouter>,
  document.getElementById('root')
);