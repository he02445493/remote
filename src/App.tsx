import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Play, HelpCircle, Plus, Trash2, Edit3 } from 'lucide-react';

interface Card {
  id: string;
  text: string;
  isFlipped: boolean;
  color: string;
}

interface Category {
  name: string;
  items: string[];
}

const defaultCategories: Record<string, Category[]> = {
  '飲食': [
    { name: '早餐', items: ['麥當勞', '永和豆漿', '肯德基', '早餐店', '三明治'] },
    { name: '午餐', items: ['便當', '拉麵', '義大利麵', '壽司', '漢堡'] },
    { name: '晚餐', items: ['火鍋', '燒烤', '炒飯', '牛排', '披薩'] }
  ],
  '娛樂': [
    { name: '遊戲', items: ['電玩', '桌遊', '運動', '卡牌', '益智遊戲'] },
    { name: '活動', items: ['看電影', '逛街購物', '郊遊踏青', '運動健身', '聚會派對'] }
  ]
};

const initialQuestions = [
  '今天想吃什麼？',
  '今天要看什麼電影？',
  '今天想去哪裡玩？',
  '今天要做什麼運動？',
  '今天喝什麼飲料？',
  '今天吃什麼甜點？',
  '今天要去哪裡約會？',
  '今天要玩什麼遊戲？'
];

const generateRandomColor = () => {
  const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-green-500',
    'from-orange-500 to-yellow-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showTips, setShowTips] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('早餐');
  const [customItems, setCustomItems] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryGroup, setNewCategoryGroup] = useState('');

  useEffect(() => {
    const randomQuestion = initialQuestions[Math.floor(Math.random() * initialQuestions.length)];
    setCurrentQuestion(randomQuestion);
    const initialItems = defaultCategories['飲食'][0].items;
    initializeCards(initialItems);
    setCustomItems(initialItems.join('\n'));
  }, []);

  const initializeCards = (items: string[]) => {
    const newCards = items.map((item) => ({
      id: Math.random().toString(36).substr(2, 9),
      text: item,
      isFlipped: false,
      color: generateRandomColor()
    }));
    setCards(newCards);
  };

  const flipCard = (id: string) => {
    const unflippedCount = cards.filter(card => !card.isFlipped).length;
    if (unflippedCount <= 1) {
      alert('請重新洗牌或重設！');
      return;
    }

    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    const selectedCard = cards.find(card => card.id === id);
    if (selectedCard) {
      setHistory([selectedCard.text, ...history.slice(0, 9)]);
    }
  };

  const shuffle = () => {
    setCards(cards.map(card => ({ ...card, color: generateRandomColor() })));
    setCards(prevCards => [...prevCards].sort(() => Math.random() - 0.5));
  };

  const reset = () => {
    const items = customItems.split('\n').filter(item => item.trim());
    initializeCards(items);
  };

  const startPicking = () => {
    const unflippedCards = cards.filter(card => !card.isFlipped);
    if (unflippedCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * unflippedCards.length);
      flipCard(unflippedCards[randomIndex].id);
    } else {
      alert('請先重設或重新洗牌！');
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const categoryItems = defaultCategories['飲食'].find(c => c.name === category)?.items || [];
    setCustomItems(categoryItems.join('\n'));
    initializeCards(categoryItems);
  };

  const handleCustomItemsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCustomItems(newValue);
    const items = newValue.split('\n').filter(item => item.trim());
    if (items.length >= 3) {
      initializeCards(items);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Cards */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入標題..."
            className={`w-full mb-4 p-2 text-2xl font-bold border-b-2 focus:outline-none ${
              !title ? 'text-gray-400 border-gray-300' : 'text-gray-800 border-blue-500'
            }`}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-[3/4] relative cursor-pointer transform transition-all duration-500 ${
                  card.isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => !card.isFlipped && flipCard(card.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-lg shadow-md flex items-center justify-center text-white text-3xl font-bold`}>
                  ?
                </div>
                <div className={`absolute inset-0 bg-white border-4 border-blue-500 rounded-lg shadow-md flex items-center justify-center text-xl font-bold transform ${
                  card.isFlipped ? 'rotate-y-180 opacity-100' : 'opacity-0'
                }`}>
                  {card.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">分類選擇</h2>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus size={16} />
                新增分類
              </button>
            </div>
            {Object.entries(categories).map(([group, categoryList]) => (
              <div key={group} className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">{group}</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryList.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryChange(category.name)}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategory === category.name
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Items Input */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">自定義選項</h2>
            <textarea
              value={customItems}
              onChange={handleCustomItemsChange}
              placeholder="每行輸入一個選項"
              className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startPicking}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              disabled={!title}
            >
              <Play size={20} />
              開始抽籤
            </button>
            <button
              onClick={shuffle}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={!title}
            >
              <Shuffle size={20} />
              重新洗牌
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={!title}
            >
              <RotateCcw size={20} />
              重設
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">歷史記錄：</h3>
              <ul className="space-y-2">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 p-3 rounded-lg text-gray-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">新增分類</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分類群組
                </label>
                <input
                  type="text"
                  value={newCategoryGroup}
                  onChange={(e) => setNewCategoryGroup(e.target.value)}
                  placeholder="例如：飲食、娛樂"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分類名稱
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="例如：早餐、午餐"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (newCategoryName && newCategoryGroup) {
                      setCategories(prev => ({
                        ...prev,
                        [newCategoryGroup]: [
                          ...(prev[newCategoryGroup] || []),
                          { name: newCategoryName, items: [] }
                        ]
                      }));
                      setShowCategoryModal(false);
                      setNewCategoryName('');
                      setNewCategoryGroup('');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  新增
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;