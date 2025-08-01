import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heic2any from "heic2any";


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

    const [isSuccess, setIsSuccess] = useState(false)

    const [newItemId, setNewItemId] = useState('');
    const [NewItemEmail, setNewItemEmail] = useState('');
    const [other, setOther] = useState('');
    const [itemTagOptions, setItemTagOptions] = useState([])
    const [colorTagOptions, setColorTagOptions] = useState([])
    const [placeTagOptions, setPlaceTagOptions] = useState([])
 
    const navigate = useNavigate();
    const [foundDate, setFoundDate] = useState('') //YYYY-MM-DD
    const [foundPeriod, setFoundPeriod] = useState('AM')
    const [foundTime, setFoundTime] = useState('') //HH
     
    const toggle = (value, list, setter) =>
        list.includes(value)
            ? setter(list.filter((v) => v !== value))
            : setter([...list, value])

    const handleFileChange = async (e) => {
      const selected = Array.from(e.target.files);
      const processed = [];
      for (const file of selected) {
        if (file.type === "image/heic" || file.name.match(/\.heic$/i)) {
          try {
            const blob = await heic2any({ blob: file, toType: "image/jpeg" });
            const jpegFile = new File(
              [blob],
              file.name.replace(/\.heic$/i, ".jpg"),
              { type: "image/jpeg" }
            );
            processed.push(jpegFile);
          } catch (err) {
            console.error("HEIC変換エラー:", err);
          }
        } else {
          processed.push(file);
        }
      }
      // 既存の files と結合
      const newFiles = [...files, ...processed];
      if (newFiles.length > 5) {
        setError('アップロードできる写真は最大５枚です');
        return;
      }
      setFiles(newFiles);
      setError('');
    };

    useEffect(() => {
        const getTags = async() => {
          try {
            const res = await fetch('/api/get_tags',{
              method: 'GET',
              headers: {'Accept': 'application/json'}
            });
            if (!res.ok) {
              throw new Error(`Server responded with ${res.message}`)
            }
            const data = await res.json();
            setItemTagOptions(data.item_tags)
            setColorTagOptions(data.color_tags)
            const flattenedPlaces = Object.values(data.place_tags).flat();
            setPlaceTagOptions(flattenedPlaces)
          } catch(err) {
            console.log('タグ取得の際にエラーが発生しました')
          }
        };
        getTags();
      }, [])

    // 選択画像を削除する関数
    const removeImage = (index) => {
      setFiles(files.filter((_, i) => i !== index));
    };

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
        formData.append('other', other);
        formData.append('found_date', foundDate)
        formData.append('found_period', foundPeriod)
        formData.append('found_time', foundTime)
        
        try {
            const res = await fetch('api/new_items', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error(`Servere responded with ${res.status}`);
            const data = await res.json();
            setNewItemId(data.item_id);
            setNewItemEmail(data.email);
            alert('登録が完了しました')
            setIsSuccess(true)
            setFiles([]);
        } catch (err) {
            console.log(err)
            setError('送信に失敗しました')
        }
    }
    if (isSuccess) {
      return (
        <main className="p-4">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold">登録が完了しました！</h2>
            <p>忘れ物ID: <span className="font-mono">{newItemId}</span></p>
            <p>メールアドレス: <span className="font-mono">{NewItemEmail}</span></p>
            <p>所有者とコンタクトを取るために必ず必要になりますので，この画面のスクリーンショットを撮ってください</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ホームに戻る
            </button>
          </div>
        </main>
      )
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
                        <div key={idx} className='relative w-24 h-24'>
                          <img
                            src={URL.createObjectURL(f)}
                            alt={`preview-${idx}`}
                            className='w-full h-full object-cover rounded border'
                          />
                          <button
                            type='button'
                            onClick={() => removeImage(idx)}
                            className='absolute top-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center p-1 text-blue-500 shadow'
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                )}
                <div>
                    <span className='text-gray-700'>落とし物タグ</span>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {itemTagOptions.map((it) => (
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
                            {colorTagOptions.map((it) => (
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
                            {placeTagOptions.map((it) => (
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
                    <span className='text-gray-700'>発見日時</span>
                    <div className='flex items-center gap-2 mt-2'>
                        <input
                            type='date'
                            value={foundDate}
                            onChange={(e) => setFoundDate(e.target.value)}
                            className='border rounded p-1'
                        />
                        <select
                            value={foundPeriod}
                            onChange={(e) => setFoundPeriod(e.target.value)}
                            className='border rounded p-1'
                        >
                            <option value='AM'>午前</option>
                            <option value='PM'>午後</option>
                        </select>
                        <input
                            type='time'
                            value={foundTime}
                            onChange={(e) => setFoundTime(e.target.value)}
                            className='border rounded p-1'
                        />
                    </div>
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
                <div>
                    <span className='text-sm font-medium text-gray-700'>その他備考等</span>
                    <textarea
                        placeholder='必要な情報を入力してください'
                        value={other}
                        onChange={(e) => setOther(e.target.value)}
                        className='border-2 rounded input input-bordered w-full border-gray-300 p-2 min-h-[120px] resize-vertical'
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