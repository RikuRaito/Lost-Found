import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SearchResult = () => {
    const [results, setResults] = useState([]);
    
    useEffect(() => {
        const storedResult = localStorage.getItem('result');

        if (storedResult) {
            try {
                const parsedResult = JSON.parse(storedResult);
                setResults(parsedResult);
            } catch (err) {
                console.error("localStorageのデータのパースに失敗しました:", err);
            }
        }
    }, []); 

    return (
      <div className="min-h-screen bg-gray-100 p-4 font-sans">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">検索結果</h1>
          {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {results.map((item, index) => (
                    <Link to={`/item/${item.item_id}`} key={index}>
                      <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:scale-105 duration-300">
                          {/* 画像のパスはitem_id/filenameの形式で返されると仮定 */}
                          {item.images && item.images.length > 0 && (
                              <img
                                src={`/item_images/${item.images[0]}`}
                                alt={`${item.tags?.items?.[0] || 'アイテム'}の画像`}
                                className="w-full h-48 object-cover"
                              />
                          )}
                          <div className="p-4">
                              {/* アイテム名 */}
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {/* ここで item.tags が存在するかを確認 */}
                                  {item.tags?.items?.length > 0 ? item.tags.items[0] : '不明'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">色:</span> 
                                  {/* ここでも item.tags が存在するかを確認 */}
                                  {item.tags?.color?.length > 0 ? item.tags.color.join(', ') : '不明'}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">場所:</span> 
                                  {/* ここでも item.tags が存在するかを確認 */}
                                  {item.tags?.place?.length > 0 ? item.tags.place.join(', ') : '不明'}
                              </p>
                              {/* その他の情報 */}
                              <p className="text-sm text-gray-700">{item.other || '詳細情報なし'}</p>
                          </div>
                      </div>
                    </Link>

                  ))}
              </div>
          ) : (
              <p className="text-center text-xl text-gray-500 mt-12">一致する落とし物はありませんでした。</p>
          )}
      </div>
  );
};

export default SearchResult;