import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ItemDetails = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // 👈 追加

    useEffect(() => {
        const storedResult = localStorage.getItem('result');
        if (storedResult) {
            try {
                const allItems = JSON.parse(storedResult);
                const foundItem = allItems.find(i => String(i.item_id) === itemId);
                if (foundItem) {
                    setItem(foundItem);
                } else {
                    console.error("指定されたIDのアイテムが見つかりません。");
                }
            } catch (err) {
                console.error("localStorageのデータのパースに失敗しました:", err);
            }
        }
    }, [itemId]);


    const goToNextImage = () => {
        if (item.images) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length);
        }
    };

    
    const goToPrevImage = () => {
        if (item.images) {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex - 1 + item.images.length) % item.images.length
            );
        }
    };

    if (!item) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">アイテムが見つかりません。</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10 border-b pb-4">
                    落とし物詳細
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 画像セクションを修正 */}
                    {item.images && item.images.length > 0 && (
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="relative w-full max-w-sm mx-auto">
                                <img
                                    src={`/item_images/${item.images[currentImageIndex]}`}
                                    alt={`落とし物の画像 ${currentImageIndex + 1}`}
                                    className="w-full h-auto rounded-lg shadow-md object-cover"
                                />
                                {item.images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={goToPrevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full opacity-70 hover:opacity-100 transition-opacity"
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            onClick={goToNextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full opacity-70 hover:opacity-100 transition-opacity"
                                        >
                                            &gt;
                                        </button>
                                    </>
                                )}
                            </div>
                            <span className="mt-2 text-sm text-gray-600">
                                {currentImageIndex + 1} / {item.images.length}
                            </span>
                        </div>
                    )}

                    {/* 詳細情報セクション */}
                    <div className="md:col-span-1 flex flex-col justify-center">
                        <div className="space-y-4">
                            <p className="text-gray-700 text-lg">
                                <strong className="font-semibold text-gray-900">ID:</strong> {item.item_id}
                            </p>
                            <p className="text-gray-700 text-lg">
                                <strong className="font-semibold text-gray-900">発見日時:</strong> {item.found_date} {item.found_period} {item.found_time}
                            </p>
                            <p className="text-gray-700 text-lg">
                                <strong className="font-semibold text-gray-900">アイテムタグ:</strong> {item.tags.items.join(', ')}
                            </p>
                            <p className="text-gray-700 text-lg">
                                <strong className="font-semibold text-gray-900">色タグ:</strong> {item.tags.color.join(', ')}
                            </p>
                            <p className="text-gray-700 text-lg">
                                <strong className="font-semibold text-gray-900">場所タグ:</strong> {item.tags.place.join(', ')}
                            </p>
                            <p className="text-gray-700 text-lg">
                                <strong className="font-semibold text-gray-900">その他:</strong> {item.other}
                            </p>
                        </div>
                    </div>
                </div>
                <Link to={'/'}>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                落とし物検索ページへ
              </button>
                </Link>
            </div>

        </div>
    );
};

export default ItemDetails;