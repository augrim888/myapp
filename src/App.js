import {useState} from 'react';
import database from './firebase';
import { isMobile } from 'react-device-detect';
  
function App() {
 // const []
  // Push Function
  const pushStart = () => {
    database.ref().update({
      start : startArr,
    }).catch(alert);
  }
  const pushEnd = () => {
    database.ref().update({
      end : endArr,
    }).catch(alert);
  }
    let canvas = document.getElementById("canvas");
    if(window.innerHeight<window.innerWidth)
    {
      canvas.height = window.innerHeight - (window.innerHeight/20)*3;
      canvas.width = canvas.height*0.7727;
    }
    if(window.innerHeight>window.innerWidth)
    {
      canvas.width = window.innerWidth-(window.innerWidth/20)*3;
      canvas.height = canvas.width*1.2941;
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
    let dis =0;
    let ratio=594/canvas.height;
    let startArr =[];
    let endArr = [];

    const distance = ()=>
    {

    }

    const start=(event)=>{
    is_drawing = true;
    context.beginPath();
    context.moveTo(getX(event), getY(event));
    //console.log("START: "+getX(event)+" "+getY(event));
    event.preventDefault();
    xvalStart = getX(event)*ratio;
    yvalStart = getY(event)*ratio;
    }
    
    const draw=(event)=> {
    if (is_drawing) {
    console.log("new points: "+ getX(event) +" "+ getY(event) );
    context.lineTo(getX(event), getY(event));
    values = values+1;
    if (isMobile && values>=10)
    {
      console.log("this is a mobile phone");
      xvalEnd = getX(event)*ratio;
      yvalEnd = getY(event)*ratio;
      if(xvalEnd<0)
      {
        xvalEnd=0;
      }
      if(yvalEnd<0)
      {
        yvalEnd=0;
      }
      startArr.push([xvalStart,yvalStart]);
      endArr.push([xvalEnd,yvalEnd]);
      xvalStart = xvalEnd;
      yvalStart = yvalEnd;
      values=0;
    }
    else if(values>=10){
      xvalEnd = getX(event)*ratio;
      yvalEnd = getY(event)*ratio;
      if(xvalEnd<0)
      {
        xvalEnd=0;
      }
      if(yvalEnd<0)
      {
        yvalEnd=0;
      }
      startArr.push([xvalStart,yvalStart]);
      endArr.push([xvalEnd,yvalEnd]);
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
      xvalEnd = getX(event)*ratio;
      yvalEnd = getY(event)*ratio;
     }
    event.preventDefault();
    }

    const stop=(event)=> {
    if (is_drawing) {
    context.stroke();
    console.log("END: "+xvalEnd+" "+yvalEnd);
    if(xvalEnd<0)
    {
      xvalEnd=0;
    }
    if(yvalEnd<0)
    {
      yvalEnd=0;
    }
    startArr.push([xvalStart,yvalStart]);
    endArr.push([xvalEnd,yvalEnd]);
    pushStart();
    pushEnd();
    startArr=[];
    endArr =[];
    is_drawing = false;
    values = 0;
    if(xvalStart==xvalEnd && yvalStart==yvalEnd && xvalStart!=0 && yvalStart!=0)
    {
      console.log("haha point");
      context.fillStyle= "#000";
      context.fillRect(xvalStart,yvalStart,1,1);
    }
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