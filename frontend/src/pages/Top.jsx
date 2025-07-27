import { useEffect,useState } from 'react'


function Top() {
  
  const healthCheck = async() => {
    try {
    const res = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 認証 Cookie が必要な場合は credentials: 'include'
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    console.log(data)
  } catch (err) {
    console.error('Health check failed:', err);
    throw err;
  }
  }
    return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-emerald-500">
        Tailwind v4 OK!
      </h1>
      <button
        onClick={healthCheck}
        className="px-6 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
      >
        ヘルスチェック
      </button>
    </div>
  );
}


export default Top
