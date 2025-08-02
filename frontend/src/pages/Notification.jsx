import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Notification = () => {
    const [itemId, setItemId] = useState('')
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem('isLoggedIn') === 'true'
    )
    const [email, setEmail] = useState(() => 
        isLoggedIn ? localStorage.getItem('email' || '') : '' 
    )

    const [items, setItems] = useState([])

    const fetchItemList = async() => {
        if (!isLoggedIn) {
            console.log('ログインしている場合のみこの関数を使ってください')
            return;
        }
        try {
            const res = await fetch('/api/get_message_list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': email
                })
            })
            if (!res.ok) {
                console.log('エラーが発生しました')
            }
            setItems(res.list)
        } catch (err) {
            console.log('エラーが発生しました')
        }
    }

    const verifyAndFetchItem = async(e) => {
        e.preventDefault();
        try {
            const res = fetch('/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify ({
                    'itemId': itemId,
                    'mail': email
                })
            })
            if (!res.ok) {
                console.log('エラーが発生しました')
            }
            const { roomId } = await res.json();
            navigate(`/chat/${roomId}`)
        } catch (err) {
            console.log('エラーが発生しました', err)
        }
    }

    if (!isLoggedIn) {
        return (
            <main className="flex items-center justify-center bg-gray-50 px-4 h-[calc(100vh-4rem)] overflow-hidden">
                <form
                    className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500"    
                    onSubmit={verifyAndFetchItem}
                >
                    <h1 className="text-2xl font-bold text-center mb-8">
                        Lost<span className="text-blue-600">Found</span>{t('access.access')}
                    </h1>
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700">{t('access.id')}</span>
                        <input
                            placeholder={t('access.id')}
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{t('access.email')}</span>
                        <input
                            type="email"
                            placeholder={t('acess.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
                    >{t('access.submit')}
                    </button>
                </form>
            </main>
        )
    }
    return (
        <main>
            <h1>ログイン失敗</h1>
        </main>
    )
}

export default Notification