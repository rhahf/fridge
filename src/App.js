import React, { StrictMode, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {Stage, Layer, Rect, Circle, Transformer}  from 'react-konva';
import Konva from 'konva'
import './App.css';

Konva.pixelRatio = 1

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }

function App() {

  const [sizeX,sizeY]  = [3000,3000]
  const [size,setsize] = useState({width:sizeX,height:sizeY})
  const [selected,setselected] = useState("")
  const [dragging,setdragging] = useState()

  const scrollContainer = useRef()
  //const [Size,setSize] = useState({width:document.documentElement.clientWidth*2,height:document.documentElement.clientHeight*2})

  const [shapes,setShapes] = useState([{
    id: "0",
    x: 200,
    y: 200,
    width: 200,
    height: 200,
    stroke:'black',
    isDragging: false
    // isDragging: true;
  }])

  const transformerRef = useRef()

  useEffect(()=> {
    if (selected) {
      console.log(transformerRef)
      transformerRef.current.nodes([selected])
      transformerRef.current.getLayer().batchDraw()
    }
  },[selected])

  const select = (e) => {
    const id = e.target.id()
    if (id) {
      console.log(e.target)
      setselected(e.target)
    }
    // console.log(e.target.id())
    // setselected(id)
    // setselected(e.target.id())
  }
  // const [stageSize,setStageSize] = useState()
  const stage = useRef()
  
  useEffect(()=> {
    window.addEventListener('resize', function(event) {
      setsize({width:sizeX,height:sizeY})
    }
  )})

  const onDragMove = (e) => {
    const id = e.target.id()
    setdragging(id) 
  }

  const onDragEnd = (e) => {
    if (dragging) {
      const id     = e.target.id()
      // const width  = e.target.width() 
      // const height = e.target.height()
      const x      = e.target.x()
      const y      = e.target.y()
      shapes[id].x = x
      shapes[id].y = y
      setShapes(shapes)
    }
  }

  const onTransformEnd = (e) => {
    if (selected) {
      const id    = e.target.id()
      const width = e.target.width() ? (e.target.width() !== undefined)  : e.target.radius()
      const height = e.target.height() ? (e.target.height() !== undefined) : e.target.radius()
      shapes[id].width = width
      shapes[id].height = height
      setShapes(shapes)
      console.log(width,shapes,e.target.radius())
      //shapes.selected()
    }
  }

  const scale = (window.innerWidth) / size.width
    
  const dragBound = (s,p) => {
    s = s * scale
    // console.log(stage,stage.current.width(),p.x)
    const height = stage.current.height()
    const width  = stage.current.width()
    return {
      x: clamp(p.x,s,width-s),
      y: clamp(p.y,s,height-s)
    }
  }
  // const scale = size.width / 800

  return (
    <div ref={scrollContainer} className="App">
      <Stage ref={stage} className="Stage" width={size.width} height={size.height} scaleX={scale} scaleY={scale}>
        <Layer>
          {/* <Circle x={150} y={150} stroke="black" radius={150} /> */}
          {shapes.map((shape)=> (
            //console.log("x",shape.x),
            <Circle
            _useStrictMode
            onMouseDown={select}
            onTap={select}
            onDragMove={onDragMove}
            //onMouseDown={onMouseDown}
            // onDragStart={(e)=> onDragStart(e)}
            // onDragEnd={onDragEnd}
            // onDragMove={onDrageMove}
            draggable
            onDragEnd={onDragEnd}
            onTransform={(e)=>console.log(e)}
            dragBoundFunc={(p)=>dragBound(shape.width,p)}
            key={shape.id} 
            id={shape.id}
            x={shape.x} 
            y={shape.y} 
            stroke={shape.stroke}
            radius={shape.width} />
          ))}
          {selected !== undefined &&
          <Transformer
            ref={transformerRef}
            rotateEnabled = {false}
            enabledAnchors={['top-right','top-left','bottom-left','bottom-right']}
           // onTransformEnd={onTransformEnd}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              //selected.radius
              if (newBox.width < 30 || newBox.height < 30) {
                return oldBox;
              }
              
              // console.log(newbo)
              
              const id = selected.id()
              const {x,y,height,width}  = newBox
             
              shapes[id].width = clamp(x,width,sizeX- width)
              shapes[id].height = clamp(y,height,sizeY-height)
              
              setShapes(shapes)

              return newBox;
            }}
          />}
        </Layer>
      </Stage>
    </div>
  );
}


export default App;