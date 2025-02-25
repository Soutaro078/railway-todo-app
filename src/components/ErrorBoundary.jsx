import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 次のレンダリングでフォールバック UI が表示されるように状態を更新します
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // エラーログを外部サービスに送信する
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // フォールバック UI をレンダリングします
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
