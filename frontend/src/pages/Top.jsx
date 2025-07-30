import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const items = [
    "財布", "スマホ", "バッグ", "充電器"
];

const colors = [
    "茶色", "赤", "青", "オレンジ", "黄色", "黒"
]

const places = {
    "東京都": [
        "全域", "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区",
        "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区",
        "練馬区", "足立区", "葛飾区", "江戸川区"
    ]
};

const allPlaces = Object.values(places).flat();

function Top() {
  const [tags, setTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('item'); // 'item' | 'place' | 'color'
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // --- server health‑check -------------------------------------------------
  const healthCheck = async () => {
    try {
      const res = await fetch('/api/health', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  useEffect(() => {
    healthCheck();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableOptions =
    (activeTab === 'item'
      ? items
      : activeTab === 'place'
      ? allPlaces
      : colors // activeTab === 'color'
    ).filter((opt) => !tags.includes(opt));

  const handleOptionClick = (option) => {
    setTags([...tags, option]);
    setShowDropdown(false)
  }

  const removeTag = (idxToRemove) => {
    setTags(tags.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSearch = async() => {
    try {
        const res = await fetch('api/search_items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'tags': tags
        })
    })
    if (!res.ok) {
        throw new Error(`HTTPS error. status: ${res.status}`)
    }
    result = res.data
    localStorage.setItem('result', result)
    navigate('/');
    } catch (err) {
        console.log('エラーが発生しました', err)
    }
    
  }


  // --- render --------------------------------------------------------------
  return (
    <main className="p-4">
      <div className="max-w-md mx-auto" ref={wrapperRef}>
        <label
          htmlFor="tag-input"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          落とし物タグ
        </label>

        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
            >
              {tag}
              <button
                className="ml-1 text-blue-500 hover:text-blue-700"
                onClick={() => removeTag(idx)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        <div
            id="tag-input"
            tabIndex={0}
            className='w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300 cursor-pointer'
            onFocus={() => setShowDropdown(true)}
            onClick={() => setShowDropdown(true)}
            >
                {availableOptions.length === 0 ? (
                    <span className='text-gray-400'>追加できるタグはありません</span>
                ) : (
                    <span className='text-gray-400'>タグを選択...</span>
                )}
            </div>
            {showDropdown && (
              <div className='border border-gray-300 rounded mt-1 bg-white shadow'>
                {/* --- tab headers --------------------------------------------------- */}
                <div className='flex border-b'>
                  <button
                    className={`flex-1 py-2 text-sm ${
                      activeTab === 'item'
                        ? 'border-b-2 border-blue-500 font-semibold'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('item')}
                  >
                    落とし物
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm ${
                      activeTab === 'place'
                        ? 'border-b-2 border-blue-500 font-semibold'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('place')}
                  >
                    落とした場所
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm ${
                        activeTab === 'color'
                        ? 'border-b-2 border-blue-500 font-semibold'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('color')}
                    >
                        色
                    </button>
                </div>

                {/* --- options list -------------------------------------------------- */}
                {availableOptions.length > 0 ? (
                  <ul className='max-h-48 overflow-auto'>
                    {availableOptions.map((option) => (
                      <li
                        key={option}
                        className='px-4 py-2 hover:bg-blue-50 cursor-pointer'
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className='px-4 py-2 text-sm text-gray-400'>追加できる候補がありません</div>
                )}
              </div>
            )}
      </div>
      <button
        className="
          mt-6 px-6 py-2 rounded-md
          bg-blue-500 text-white font-semibold
          hover:bg-blue-600 active:bg-blue-700
          disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
          shadow-md transition-colors duration-150
          w-fit mx-auto block
        "
        onClick={handleSearch}
        >
        検索
      </button>

      <a href='/new_items'
        className="
          mt-6 px-6 py-2 rounded-md
          bg-blue-500 text-white font-semibold
          hover:bg-blue-600 active:bg-blue-700
          disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
          shadow-md transition-colors duration-150
          w-fit mx-auto block
        "
        >
            落とし物登録
        </a>
    </main>
  );
}

export default Top;
