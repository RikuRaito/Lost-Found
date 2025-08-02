import React, { useEffect, useState } from 'react';

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
        <div>
            <h1>検索結果</h1>
            {results.length > 0 ? (
                <ul>
                    {results.map((item, index) => (
                        <li key={index}>
                            <h3>落とし物: {item.name}</h3>
                            <p>色: {item.color}</p>
                            <p>場所: {item.place}</p>
                            <p>詳細: {item.description}</p>
                            <div className="mt-4">
                                <img
                                    src={item.images[0]} // 最初の画像を表示
                                    alt={`${item.name}の画像`}
                                    className="w-full h-auto max-h-96 object-cover rounded"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>一致する落とし物はありませんでした。</p>
            )}
        </div>
    );
};

export default SearchResult;