import { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            })
            if (!res.ok) {
                throw new Error(`HTTP error. status: ${res.status}`)
            }
            const data = await res.json();
            console.log(data.status)
        } catch (err) {
            console.log('ログイン失敗', err)
        }
    };

    return (
        <main className='flex items-center justify-center bg-gray-50 px-4 h-[calc(100vh-4rem)] max-h-[calc(100vh-10rem)] overflow-hidden'>
            <form 
                className='w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500'
                onSubmit={handleSubmit}
                >
                <h1 className="text-2xl font-bold text-center mb-8">
                  Lost<span className="text-blue-600">Found</span> ログイン
                </h1>
                <label className='block space-y-2'>
                    <span className='text-sm font-medium text-gray-700'>メールアドレス</span>
                    <input 
                        type='email'
                        placeholder='メールアドレス'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='border-2 rounded-1px input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                </label>
                <label className='block space-y-2'>
                    <span className='text-sm font-medium text-gray-700'>パスワード</span>
                    <input
                        type='password'
                        placeholder='パスワード'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border-2 rounded-1px input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                </label>
                <button 
                    type='submit' 
                    className='w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold
                    shadow-sm transition-colors'
                    >
                    送信
                </button>
                <p className='text-center text-sm text-gray-600'>
                    アカウントをお持ちでない方は
                    <a
                        href='/signup'
                        className='text-blue-500 hover:underline ml-1'
                    >
                        新規登録はこちら
                    </a>
                </p>
            </form>
        </main>
    )
}

export default Login