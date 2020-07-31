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
  const [timerId, setTimerId] = useState(null)
  // 计时器操作序号
  const [timerNumber, setTimerNumber] = useState(1)
  // 延迟时间
  const [delayTime, setDelayTime] = useState(document.visibilityState === 'hidden' ? invisibleDelay : visibleDelay)
  const [timestamp, setTimestamp] = useState(new Date().getTime())
  // 触发事件后初始化
  const initTimer = () => {
    setIsEventActive(true)
    if (timerId) clearTimeout(timerId)
    console.log(timerId)
    setTimerNumber(0)
    // 触发事件后的30分钟无操作进入timer初始化
    const timer = setTimeout(() => {
      if (!isEventActive) {
        setIsEventActive(false)
        setTimerNumber(1)
      }
    }, delayTime)
    console.log(111, timer)
  }
  // 定时器顺序执行操作
  const timerOrder = () => {
    if (timerNumber !== timerTimes) {
      console.warn(`第${timerNumber}次无操作, 请尽快操作页面, ${timerTimes}次后将刷新页面`)
      setTimerNumber(o => o + 1)
    } else {
      console.log('刷新')
      window.location.reload()
    }
  }

  useEffect(() => {
    const isVisible = !(document.visibilityState === 'hidden')
    console.log(isVisible, isEventActive, timerNumber)
    const timer = setTimeout(() => {
      // 可见状态下，当前页面2个30分钟无操作
      if (!isEventActive && isVisible && timerNumber) {
        timerOrder()
      }
      // 不可见状态下
      else if (!isVisible) {
        timerOrder()
      }
      // 可见状态下有操作
      else {
        setIsEventActive(false)
        clearTimeout(timer)
      }
    }, delayTime)
    // 设置timerId，以触发事件后清除当前计时器
    setTimerId(timer)
  }, [isEventActive, timerNumber, delayTime])

  useEffect(() => {
    // 浏览器切换事件
    document.addEventListener('visibilitychange', () => {
      // 状态判断
      if (document.visibilityState === 'hidden') {
        // document.title = '不可见';
        setDelayTime(invisibleDelay)
        initTimer()
      } else {
        // document.title = '可见';
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
  })

  return (
    <button>test</button>
  )
}

export default App
