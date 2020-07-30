import React, {useState, useEffect} from 'react';
import './App.css';
import TestCharts from './D3test1'
import D3test2 from './D3test2'
import './D3test2.css'
import {Router} from '@reach/router'

const delayTime = 3000

const App = () => {
  const [isEventActive, setIsEventActive] = useState(false)
  const [timerId, setTimerId] = useState(0)
  const [timerNumber, setTimerNumber] = useState(1)

  const initTimer = (timerId, isEventActive, timerNumber) => {
    setIsEventActive(true)
    clearTimeout(timerId)
    setTimerNumber(0)
    const timerInit = setTimeout(() => {
      if(!isEventActive && timerNumber) {
        setIsEventActive(false)
        setTimerNumber(1)
      }
      clearTimeout(timerInit)
    })
  }

  useEffect(() => {
    const isVisible = !(document.visibilityState === 'hidden')
    // console.log(isVisible, isEventActive, timerNumber)
    const timer = setTimeout(() => {
      // 当前页面2个30分钟无操作
     if (!isEventActive && isVisible && timerNumber){
        if (timerNumber === 1) {
          console.warn('请尽快操作页面，30分钟后重新刷新')
          setTimerNumber(2)
        }
        else if (timerNumber === 2)
          window.location.reload()
     }
     else {
      setIsEventActive(false)
      clearTimeout(timer)
     }
    }, delayTime)
    setTimerId(timer)
  }, [isEventActive, timerNumber])

  useEffect(() => {
    // 浏览器切换事件
    document.addEventListener('visibilitychange', () => {
      // 状态判断
      if (document.visibilityState === 'hidden') {
          document.title = '不可见';
          setIsEventActive(false)
          // console.log(111, new Date())
      }
      else {
          document.title = '可见';
          setIsEventActive(true)
          // console.log(222, new Date())
      }
    })

    document.addEventListener('mousedown', () => {
      initTimer(timerId, isEventActive, timerNumber)
    })
    document.addEventListener('mousemove', () => {
      initTimer(timerId, isEventActive, timerNumber)
    })
    document.addEventListener('keypress', () => {
      initTimer(timerId, isEventActive, timerNumber)
    })

  }, [timerId, isEventActive, timerNumber])


  return (
  //  <div className="triangle"></div>
    <>
      <div className="test1"></div>
      <div className="test2"></div>
    </>
    // <div>
    //   <Router>
    //     <TestCharts path="/" />
    //     <D3test2 path="/D3test2" />
    //   </Router>
    // </div>
  );
}

export default App;
