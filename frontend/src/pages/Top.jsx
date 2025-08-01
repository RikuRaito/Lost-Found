import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Top() {
  const [tags, setTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('item'); // 'item' | 'place' | 'color'
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [itemTagOptions, setItemTagOptions] = useState([])
  const [colorTagOptions, setColorTagOptions] = useState([])
  const [placeTagOptions, setPlaceTagOptions] = useState([])

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

  const availableOptions =
    (activeTab === 'item'
      ? itemTagOptions
      : activeTab === 'place'
      ? placeTagOptions
      : colorTagOptions // activeTab === 'color'
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
    <main className="relative h-fit m-66">
      <div className='absolute inset-0 bg-cover bg-center -z-10'></div>
      <div className='relative z-10 p-4'>
        <div className="max-w-md mx-auto" ref={wrapperRef}>
          <label
            htmlFor="tag-input"
            className="block mb-2 text-sm font-medium text-white"
          >
            
          </label>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-xl"
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
              className='w-full bg-white border-2 border-black rounded p-2 focus:outline-none focus:ring focus:border-blue-300 cursor-pointer'
              onFocus={() => setShowDropdown(true)}
              onClick={() => setShowDropdown(true)}
              >
                  {availableOptions.length === 0 ? (
                      <span className='text-black font-bold'>追加できるタグはありません</span>
                  ) : (
                      <span className='text-black font-bold'>タグを選択...</span>
                  )}
              </div>
              {showDropdown && (
                <div className='border border-gray-300 rounded-xl mt-1 bg-white shadow'>
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
            mt-6 px-6 py-2 rounded-xl
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
      </div>
    </main>
  );
}

export default Top;
