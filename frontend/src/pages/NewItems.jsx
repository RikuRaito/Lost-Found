import { useState } from 'react'

const items = [
    "財布", "スマホ", "バッグ", "充電器", "イヤホン"
];

const colors = [
    "茶色", "赤", "青", "オレンジ", "黄色", "黒"
]

const places = {
    "東京都": [
        "東京都全域", "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区",
        "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区",
        "練馬区", "足立区", "葛飾区", "江戸川区"
    ]
};

const allPlaces = Object.values(places).flat();

const NewItems = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [itemTags, setItemTags] = useState([])
    const [colorTags, setColorTags] = useState([])
    const [placeTags, setPlaceTags] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem('isLoggedIn') === 'true'
    )
    const [email, setEmail] = useState(() => 
      isLoggedIn ? (localStorage.getItem('email') || '') : ''
    );

    const [confirmEmail, setConfirmEmail] = useState(() => 
      isLoggedIn ? (localStorage.getItem('email') || '') : ''
    );
     
    const toggle = (value, list, setter) =>
        list.includes(value)
            ? setter(list.filter((v) => v !== value))
            : setter([...list, value])

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);

        if (selected.length > 5) {
            setError('アップロードできる写真は最大５枚です');
            return;
        }
        setFiles(selected);
        setError('')
    }


    const handleSubmit = async() => {
        if (files.length === 0) {
            setError('少なくとも１枚の画像を選択してください')
            return;
        }

        const formData = new FormData();
        files.forEach((f) => formData.append('images', f));
        formData.append('item_tags', JSON.stringify(itemTags));
        formData.append('color_tags', JSON.stringify(colorTags));
        formData.append('place_tags', JSON.stringify(placeTags));
        formData.append('email', email);
        
        try {
            const res = await fetch('api/new_items', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error(`Servere responded with ${res.status}`);
            alert('登録が完了しました')
            setFiles([]);
        } catch (err) {
            console.log(err)
            setError('送信に失敗しました')
        }
    }

    return (
        <main className="p-4">
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="text-xl font-bold">落とし物登録</h1>
                <label className="block">
                    <span className="text-gray-700">写真（最大５枚）</span>
                    <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleFileChange}
                        className="mt-1 block w-full file:mr-4 file:px-4 file:py-2
                        file:rounded-md file:border-0 file:text-sm
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                </label>
                {files.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                        {files.map((f, idx) => (
                            <img
                                key={idx}
                                src={URL.createObjectURL(f)}
                                alt={`preview-${idx}`}
                                className='w-24 h-24 object-cover rounded border'
                            />
                        ))}
                    </div>
                )}
                <div>
                    <span className='text-gray-700'>落とし物タグ</span>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {items.map((it) => (
                                <button
                                    key={it}
                                    type='button'
                                    onClick={() => toggle(it, itemTags, setItemTags)}
                                    className={`px-3 py-1 rounded-full text-sm border hover:bg-blue-200
                                        ${itemTags.includes(it)
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-gray-100'}
                                        `}
                                        >
                                            {it}
                                        </button>
                            ))}
                        </div>
                </div>
                <div>
                    <span className='text-gray-700'>色タグ
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {colors.map((it) => (
                                <button
                                    key={it}
                                    type='button'
                                    onClick={() => toggle(it, colorTags, setColorTags)}
                                    className={`px-3 py-1 rounded-full text-sm border hover:bg-blue-200
                                        ${colorTags.includes(it)
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-gray-100'}
                                        `}
                                        >
                                            {it}
                                        </button>
                            ))}
                        </div>
                    </span>
                </div>
                <div>
                    <span className='text-gray-700'>発見場所タグ
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {allPlaces.map((it) => (
                                <button
                                    key={it}
                                    type='button'
                                    onClick={() => toggle(it, placeTags, setPlaceTags)}
                                    className={`px-3 py-1 rounded-full text-sm border hover:bg-blue-200
                                        ${placeTags.includes(it)
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-gray-100'}
                                        `}
                                        >
                                            {it}
                                        </button>
                            ))}
                        </div>
                    </span>
                </div>
                <div>
                    <span className='text-sm font-medium text-gray-700'>メールアドレス</span>
                    <p className='text-sm text-gray-600 mb-1'>こちらのメールアドレスを使って落とし物の所有者とコンタクトが可能となります</p>
                    <input
                        type='emmail'
                        placeholder='メールアドレスを入力'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='border-2 rouded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        disabled={isLoggedIn}
                    />
                    <span className='text-sm font-medium text-gray-700'>メールアドレス(確認)</span>
                    <input
                        type='email'
                        placeholder='メールアドレスを入力(確認)'
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className='border-2 rouded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        disabled={isLoggedIn}
                    />
                </div>
                {error && <p className='text-red-500 text-sm'>{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={email !== confirmEmail}
                  className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${
                    email && confirmEmail && email === confirmEmail
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      : 'bg-blue-300 cursor-not-allowed'
                  }`}
                >
                  登録
                </button>
            </div>
        </main>
    )
}

export default NewItems