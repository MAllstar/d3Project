/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'

// 可见状态下的延迟
const visibleDelay = 3000
// 不可见状态下的延迟
const invisibleDelay = 1000
// 触发刷新定时器执行次数
const timerTimes = 2

const App = () => {
  // 是否触发事件
  const [isEventActive, setIsEventActive] = useState(false)
  // 计时器id
  // const [timerId, setTimerId] = useState(null)
  // 计时器操作序号
  const [timerNumber, setTimerNumber] = useState(1)
  // 延迟时间
  const [delayTime, setDelayTime] = useState(document.visibilityState === 'hidden' ? invisibleDelay : visibleDelay)
  // 时间戳
  // const [timestamp, setTimestamp] = useState(new Date().getTime())

  // 触发事件后初始化
  const initTimer = () => {
    setIsEventActive(true)
    setTimerNumber(1)
  }
  // 定时器顺序执行操作
  const timerOrder = () => {
    if (timerNumber < timerTimes) {
      console.warn(`第${timerNumber}次无操作, 请尽快操作页面, ${timerTimes}次后将刷新页面`)
      // 定时器回调函数可以完美地在每次触发的时候给React发送c => c + 1更新指令。
      setTimerNumber(c => c + 1)
    } else {
      console.log('刷新')
      window.location.reload()
    }
  }

  const reloadPage = () => {
    const isVisible = !(document.visibilityState === 'hidden')
    // console.log(isVisible, isEventActive, timerNumber)
    const timer = setTimeout(() => {
      // 可见状态下，当前页面2个30分钟无操作
      if (!isEventActive && isVisible && timerNumber) {
        timerOrder()
      } else if (!isVisible) {
        // 不可见状态下
        timerOrder()
      } else {
        // 可见状态下有操作, initTimer后状态为true，此时设置状态为false，重新渲染计时
        setIsEventActive(false)
        timer && clearTimeout(timer)
      }
    }, delayTime)
    // console.log('reload', timer)
    return timer
  }

  useEffect(() => {
    const timerId = reloadPage()
    // 状态更改时会重启定时器
    return () => clearTimeout(timerId)
  }, [isEventActive, timerNumber, delayTime])


  useEffect(() => {
    // 浏览器切换事件
    document.addEventListener('visibilitychange', () => {
      // 状态判断
      if (document.visibilityState === 'hidden') {
        // 设置不可见状态下的延时
        setDelayTime(invisibleDelay)
        initTimer()
      } else {
        // 设置可见状态下的延时
        setDelayTime(visibleDelay)
        initTimer()
      }
    })

    document.addEventListener('mousedown', () => {
      initTimer()
    })
    document.addEventListener('mousemove', () => {
      initTimer()
    })
    document.addEventListener('keypress', () => {
      initTimer()
    })
    // initTimer()
  }, [])

  return (
    <button>test</button>
  )
}


export default App
