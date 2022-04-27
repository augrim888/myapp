import {useState} from 'react';
import database from './firebase';
  
function App() {
  const [xval , setXval] = useState();
  const [yval , setYval] = useState();
      
  // Push Function
  const Push = () => {
    database.ref().update({
      xval : xval,
      yval : yval,
    }).catch(alert);
  }
  
  return (
    <div className="App" style={{marginTop : 250}}>
      <center>
      <input placeholder="Enter your name" value={xval} 
      onChange={(e) => setXval(e.target.value)}/>
      <br/><br/>
      <input placeholder="Enter your age" value={yval} 
      onChange={(e) => setYval(e.target.value)}/>
      <br/><br/> 
      <button onClick={Push}>PUSH</button>
      </center>
    </div>
  );
}
  
export default App;