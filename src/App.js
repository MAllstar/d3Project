import React, {useState, useEffect} from 'react'

const delayTime = 3000

const App = () => {
  // 是否触发事件
  const [isEventActive, setIsEventActive] = useState(false)
  // 计时器id
  const [timerId, setTimerId] = useState(0)
  // 计时器操作序号
  const [timerNumber, setTimerNumber] = useState(1)

  // 触发事件后初始化
  const initTimer = (timerId, isEventActive, timerNumber) => {
    setIsEventActive(true)
    clearTimeout(timerId)
    setTimerNumber(0)
    // 触发事件后的30分钟无操作进入timer初始化
    const timerInit = setTimeout(() => {
      if (!isEventActive && timerNumber) {
        setIsEventActive(false)
        setTimerNumber(1)
      }
      clearTimeout(timerInit)
    }, delayTime)
  }

  useEffect(() => {
    const isVisible = !(document.visibilityState === 'hidden')
    // console.log(isVisible, isEventActive, timerNumber)
    const timer = setTimeout(() => {
      // 可见状态下，当前页面2个30分钟无操作
      if (!isEventActive && isVisible && timerNumber) {
        if (timerNumber === 1) {
          console.warn('请尽快操作页面，30分钟后重新刷新')
          // 修改timerNumber为2，重新渲染计时
          setTimerNumber(2)
        } else if (timerNumber === 2) window.location.reload()
      }
      // 不可见状态下
      else if (!isVisible) {
        if (timerNumber === 1) {
          console.log('不可见状态下事件')
          // 修改timerNumber为2，重新渲染计时
          setTimerNumber(2)
        } else if (timerNumber === 2) window.location.reload()
      }
      // 可见状态下有操作
      else {
        setIsEventActive(false)
        clearTimeout(timer)
      }
    }, delayTime)
    // 设置timerId，以触发事件后清除当前计时器
    setTimerId(timer)
  }, [isEventActive, timerNumber])

  useEffect(() => {
    // 浏览器切换事件
    document.addEventListener('visibilitychange', () => {
      // 状态判断
      if (document.visibilityState === 'hidden') {
        // document.title = '不可见';
        initTimer(timerId, isEventActive, timerNumber)
      } else {
        // document.title = '可见';
        initTimer(timerId, isEventActive, timerNumber)
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
    <button>test</button>
  )
}

export default App
