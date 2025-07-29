import { useState, useEffect } from 'react'

const Login = () => {
  // 1) 初期値を localStorage から取得
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 2) isLoggedIn が変わるたびに localStorage を更新
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn)
  }, [isLoggedIn])

  // 3) ログイン処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error. status: ${res.status}`)
      }

      // 認証 OK
      setIsLoggedIn(true)
      localStorage.setItem('email', email)
    } catch (err) {
      console.log('ログイン失敗', err)
    }
  }

  // 4) ログアウト処理
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('email')
  }

  // 5) 表示切り替え
  if (isLoggedIn) {
    return (
      <main className="flex items-center justify-center bg-gray-50 px-4 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
          <h1 className="text-2xl font-bold">
            ようこそ <span className="text-blue-600">LostFound</span> へ
          </h1>
          <p className="text-gray-700">既にログインしています。</p>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
          >
            ログアウト
          </button>
        </div>
      </main>
    )
  }

  // ログインフォーム
  return (
    <main className="flex items-center justify-center bg-gray-50 px-4 h-[calc(100vh-4rem)] overflow-hidden">
      <form
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-8">
          Lost<span className="text-blue-600">Found</span> ログイン
        </h1>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">メールアドレス</span>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">パスワード</span>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
        >
          ログイン
        </button>

        <p className="text-center text-sm text-gray-600">
          アカウントをお持ちでない方は
          <a href="/signup" className="text-blue-500 hover:underline ml-1">
            新規登録はこちら
          </a>
        </p>
      </form>
    </main>
  )
}

export default Login