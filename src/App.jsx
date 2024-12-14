import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [start, setStart] = useState(false);
  const [jump, setJump] = useState(false);
  const [topObstacles, setTopObtacles] = useState([]);
  const [bottomObstacles, setBottomObstacles] = useState([]);
  const [bottom, setBottom] = useState(250);
  const [velocity, setVelocity] = useState(0);
  const gravity = 0.5;
  const a = useRef(250);
  const velocityRef = useRef(0)

  console.log(bottom);
  console.log("velocity is",velocity)
  if(topObstacles.some((item)=>item.left<=355&&item.left>200&&item.height>=bottom+200))
    console.log("game over")
  else if(bottomObstacles.some((item)=>item.left<=355&&item.left>200&&item.height>=bottom-200))
    console.log("game over")

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  const randomGenerator = (min, max) => {
    let value = 0;
    while (value < 200) value = Math.floor(Math.random() * (max - min) + min);
    return value;
  };

  const max = (a, b) => (a >= b ? a : b);

  const update = () => {
    let topArr = [];
    let bottomArr = [];
    for (let index = 0; index < 4; index++) {
      let topObj = {};
      let bottomObj = {};
      topObj.left = randomGenerator(index * 400, (index + 1) * 400);
      bottomObj.left = topObj.left;
      topObj.height = randomGenerator(0, 350);
      bottomObj.height = randomGenerator(0, 350);
      topArr.push(topObj);
      bottomArr.push(bottomObj);
    }
    setTopObtacles([...topArr]);
    setBottomObstacles([...bottomArr]);
  };

  useEffect(() => {
    if (jump&&start) {
      const interval = setInterval(() => {
        setBottom((prevBottom) => {         
          const newBottom = prevBottom + velocityRef.current;
          setVelocity((prevVelocity) => prevVelocity - gravity);
          return Math.max(newBottom,-200);          
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [jump]);

  useEffect(() => {
    update();
    window.addEventListener('keydown',(event)=>{
      setJump(true);
      velocityRef.current = 10
      setVelocity(10);
      a.current = bottom;
    })
  }, []);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        let position;
        setTopObtacles((prevTopArr) => {
          let newTopArr = prevTopArr.map((obj) => ({
            ...obj,
            left: obj.left - 4,
          }));

          if (newTopArr.length > 0 && newTopArr[0].left < -144) {
            newTopArr.shift();
            let lastElement = newTopArr.at(-1);
            let prevLeft = lastElement.left;
            let newLeft = max(1600, prevLeft + 200);
            position = randomGenerator(newLeft, newLeft + 400);
            newTopArr.push({
              left: position,
              height: randomGenerator(0, 300),
            });
          }

          return newTopArr;
        });

        setBottomObstacles((prevBottomArr) => {
          let newBottomArr = prevBottomArr.map((obj) => ({
            ...obj,
            left: obj.left - 4,
          }));

          if (newBottomArr.length > 0 && newBottomArr[0].left < -144) {
            newBottomArr.shift();
            newBottomArr.push({
              left: position,
              height: randomGenerator(0, 300),
            });
          }

          return newBottomArr;
        });
      }, 10);

      return () => {
        clearInterval(interval);
        clearInterval(timer);
      };
    }
  }, [start]);

  return (
    <div className='relative overflow-hidden h-[100vh] bg-[url("https://t4.ftcdn.net/jpg/01/01/05/97/360_F_101059744_v3iOQuoEiSyUxcgiILvDzWprTkShqd7c.jpg")] bg-cover'>
      <button
        className="p-4 rounded bg-orange-400"
        onClick={() => setStart(true)}
      >
        start
      </button>
      {topObstacles.map((item, index) => (
        <img
          key={index}
          className="absolute top-0 w-36"
          style={{ left: `${item.left}px`, height: `${item.height}px` }}
          src="https://kevinmongiello.github.io/flappybird/bin/pics/pipe_180.png"
          alt=""
        />
      ))}
      {bottomObstacles.map((item, index) => (    
        <img
          key={index}
          className="absolute bottom-0 w-36"
          style={{ left: `${item.left}px`, height: `${item.height}px` }}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mario_pipe.png/196px-Mario_pipe.png"
          alt=""
        />
      ))}
      <img
        className="absolute w-[360px] h-[360px] left-[155px]"
        style={{ bottom: `${bottom}px` }}
        src="https://www.pngall.com/wp-content/uploads/15/Flappy-Bird-PNG-Images-HD.png"
        alt=""
      />
    </div>
  );
}

export default App;
