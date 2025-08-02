import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  )
  const [email, setEmail] = useState(() => 
    isLoggedIn ? (localStorage.getItem('email') || '') : ''
  );

  const [password, setPassword] = useState('')
  const { t } = useTranslation();

  // 2) isLoggedIn が変わるたびに localStorage を更新
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn)
  }, [isLoggedIn])

useEffect(() => {
  if (!isLoggedIn) return;
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/get_use_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        console.log('エラーが発生しました', response.status);
        return;
      }
      const data = await response.json();
      const itemId = data.item_id;
      // TODO: use itemId as needed
    } catch (err) {
      console.log('エラー発生', err);
    }
  };
  fetchUserData();
}, [isLoggedIn, email]);
  // 3) ログイン処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error. status: ${res.status}`);
      }

      const data = await res.json();
      // バックエンドの status フィールドで認証結果を判定
      if (data.status === 'SUCCESS') {
        setIsLoggedIn(true);
        localStorage.setItem('email', email);
        navigate('/');
      } else if (data.status === 'MISS') {
        alert('パスワードが正しくありません。');
      } else if (data.status === 'NOTFOUND') {
        alert('メールアドレスが見つかりません。');
      } else {
        alert('ログインに失敗しました。');
      }
    } catch (err) {
      console.log('ログイン失敗', err);
      alert('サーバーへの接続中にエラーが発生しました。');
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
            {t('login.welcome')} <span className="text-blue-600">LostFound</span> {t('login.welcome2')}
          </h1>
          <p className="text-gray-700">{t('login.alreadyLoggedIn')}</p>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
          >
            {t('login.logout')}
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
          Lost<span className="text-blue-600">Found</span> {t('login.login')}
        </h1>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">{t('login.email')}</span>
          <input
            type="email"
            placeholder={t('login.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">{t('login.pwd')}</span>
          <input
            type="password"
            placeholder={t('login.pwd')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
        >
          {t('login.login')}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t('login.doesntHave')}
          <a href="/signup" className="text-blue-500 hover:underline ml-1">
            {t('login.signupHere')}
          </a>
        </p>
      </form>
    </main>
  )
}

export default Login