
import database from './firebase';
import { isMobile } from 'react-device-detect';
import * as math from 'mathjs'
  
function App() {
 // const []
  // Push Function
  const pushValues = () => {
    database.ref().update({
      start : startArr,
      end : endArr,
      length: dist,
    }).catch(alert);
  }
    let canvas = document.getElementById("canvas");
    if(window.innerHeight<window.innerWidth)
    {
      canvas.height = window.innerHeight - (window.innerHeight/20)*3;
      canvas.width = canvas.height*(431/558);
    }
    if(window.innerHeight>window.innerWidth)
    {
      canvas.width = window.innerWidth-(window.innerWidth/20)*3;
      canvas.height = canvas.width*(558/431);
    }
    let context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    let restore_array = [];
    let start_index = -1;
    let stroke_color = 'black';
    let stroke_width = "2";
    let is_drawing = false;
    let xvalStart =0;
    let yvalStart=0;
    let xvalEnd=0;
    let yvalEnd=0;
    let values =0;
    let xdist=0;
    let ydist =0;
    let dist =0;
    let ratioHi = 558/canvas.height;
    let ratioWi = 431/canvas.width;
    let startArr =[];
    let endArr = [];
    let length = 0;
    const getDistance = ()=>
    {
      database.ref().get(database).then((snapshot)=>{
        length = snapshot.val().length;
        console.log(length);}) 
        return(length);
    }

    const start=(event)=>{
    is_drawing = true;
    context.beginPath();
    context.moveTo(getX(event), getY(event));
    //console.log("START: "+getX(event)+" "+getY(event));
    event.preventDefault();
    xvalStart = getX(event);
    yvalStart = getY(event);
    }
    
    const draw=(event)=> {
    if (is_drawing) {
    //console.log("new points: "+ getX(event) +" "+ getY(event) );
    context.lineTo(getX(event), getY(event));
    values = values+1;
    if (isMobile && values>=5)
    {
      console.log("this is a mobile phone");
      xvalEnd = getX(event);
      yvalEnd = getY(event);
      
      if(xvalEnd<0)
      {
        xvalEnd=0;
      }
      else if(xvalEnd>431)
      {
        xvalEnd=431;
      }
      if(yvalEnd<0)
      {
        yvalEnd=0;
      }
      else if(yvalEnd>558)
      {
        yvalEnd=558;
      }
      xdist = (xvalEnd-xvalStart)*ratioWi;
      ydist = (yvalEnd-yvalStart)*ratioHi;
      dist = dist+math.sqrt(math.pow(xdist,2)+math.pow(ydist,2))
      startArr.push([xvalStart*ratioWi,yvalStart*ratioHi]);
      endArr.push([xvalEnd*ratioWi,yvalEnd*ratioHi]);
      xvalStart = xvalEnd;
      yvalStart = yvalEnd;
      values=0;
    }
    else if(values>=10){
      xvalEnd = getX(event);
      yvalEnd = getY(event);
      if(xvalEnd<0)
      {
        xvalEnd=0;
      }
      else if(xvalEnd>431)
      {
        xvalEnd=431;
      }
      if(yvalEnd<0)
      {
        yvalEnd=0;
      }
      else if(yvalEnd>558)
      {
        yvalEnd=558;
      }
      xdist = (xvalEnd-xvalStart)*ratioWi;
      ydist = (yvalEnd-yvalStart)*ratioHi;
      dist = dist+math.sqrt(math.pow(xdist,2)+math.pow(ydist,2))
      console.log("xdist: "+xdist+" ydist: "+ ydist);
      console.log("dist = "+dist);
      startArr.push([xvalStart*ratioWi,yvalStart*ratioHi]);
      endArr.push([xvalEnd*ratioWi,yvalEnd*ratioHi]);
      xvalStart = xvalEnd;
      yvalStart = yvalEnd;
      values=0;
    }
    //console.log("we have " + values +" points so far");
    //console.log("Values:" +getX(event)+" "+getY(event));
    context.strokeStyle = stroke_color;
    context.lineWidth = stroke_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    }
    else {
      xvalEnd = getX(event);
      yvalEnd = getY(event);
     }
    event.preventDefault();
    }

    const stop=(event)=> {
    if (is_drawing) {
    context.stroke();
    //console.log("END: "+xvalEnd+" "+yvalEnd);
    if(xvalEnd<0)
    {
      xvalEnd=0;
    }
    if(yvalEnd<0)
    {
      yvalEnd=0;
    }
    is_drawing = false;
    values = 0;
    if(xvalStart==xvalEnd && yvalStart==yvalEnd && startArr.length==0 && endArr.length==0)
    {
      //console.log("haha point");
      context.fillStyle= "#000";
      context.fillRect(xvalStart,yvalStart,1,1);
      startArr.push([xvalStart*ratioWi,yvalStart*ratioHi]);
      endArr.push([xvalEnd*ratioWi,yvalEnd*ratioHi]);
    }
    dist = dist+getDistance();
    pushValues();
    startArr=[];
    endArr =[];
    dist=0;
    //console.log("total distance drawn is :"+dist+" pixels");
    }
   
    event.preventDefault();
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    start_index += 1;
    
    }

    const getX=(event)=> {
    if (event.pageX == undefined) {return event.targetTouches[0].pageX - canvas.offsetLeft}
    else {return event.pageX - canvas.offsetLeft}
    }


    const getY=(event)=> {
    if (event.pageY == undefined) {return event.targetTouches[0].pageY - canvas.offsetTop}
    else {return event.pageY - canvas.offsetTop}
    }

    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", draw, false);
    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", draw, false);
    canvas.addEventListener("mouseup", stop, false);
    canvas.addEventListener("mouseout", stop, false);

    const Restore=(event)=> {
    if (start_index <= 0) {
    Clear()
    } else {
    start_index += -1;
    restore_array.pop();
    if ( event.type != 'mouseout' ) {
    context.putImageData(restore_array[start_index], 0, 0);
    }
    }
    }
    const Clear=()=> {
    console.log("here");
    xvalStart=0;
    xvalEnd=0;
    yvalStart=0;
    yvalEnd=0;
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    restore_array = [];
    start_index = -1;
    startArr=[];
    endArr =[];
    dist=0;
}
  
  return (
    <><div className="App" style={{marginTop : 50}}>
    </div>
    <center>
      <div style ={{marginBottom:10}}>
    <button onClick={Clear}>Clear</button></div></center>
    </>
  );
}
  
export default App;