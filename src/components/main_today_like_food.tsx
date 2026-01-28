"use client";
import { useState, useEffect } from "react";
import { Food } from "@/types/food";
import { ChevronDown, ChevronUp, RefreshCw, AlertCircle } from "lucide-react";

interface MainTodayLikeFoodProps {
    mealData: {
        breakfast: Food[];
        lunch: Food[];
        dinner: Food[];
        snack: Food[];
    };
    loading: boolean;
    error: string | null;
}

export default function MainTodayLikeFood({ mealData, loading, error }: MainTodayLikeFoodProps) {

    // Sub-component for each meal section
    const MealSection = ({ title, options }: { title: string, options: Food[] }) => {
        const [selectedFood, setSelectedFood] = useState<Food | null>(null);
        const [isExpanded, setIsExpanded] = useState(false);

        // Update selected food when options change (e.g. date change)
        useEffect(() => {
            if (options && options.length > 0) {
                setSelectedFood(options[0]);
            } else {
                setSelectedFood(null);
            }
        }, [options]);

        if (!selectedFood) return (
            <div className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-700 text-md">{title}</h3>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center text-sm text-slate-400">
                    추천 식단이 없습니다.
                </div>
            </div>
        );

        return (
            <div className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-700 text-md">{title}</h3>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs flex items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors"
                    >
                        {isExpanded ? "접기" : "다른 메뉴 보기"}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {/* Main Selected Food Display */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-white overflow-hidden shadow-sm flex-shrink-0">
                            {selectedFood.food_image ? (
                                <img src={selectedFood.food_image} alt={selectedFood.food_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-800 text-lg">{selectedFood.food_name}</span>
                                <span className="font-bold text-purple-600 bg-white px-2 py-0.5 rounded-full text-sm border border-purple-100 shadow-sm">
                                    {selectedFood.food_calories} kcal
                                </span>
                            </div>
                            <div className="flex gap-3 text-xs text-slate-600 mt-2">
                                <span className="bg-white px-2 py-1 rounded-md border border-slate-100">탄수화물 {selectedFood.food_carbs}g</span>
                                <span className="bg-white px-2 py-1 rounded-md border border-slate-100">단백질 {selectedFood.food_proteins}g</span>
                                <span className="bg-white px-2 py-1 rounded-md border border-slate-100">지방 {selectedFood.food_fats}g</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expandable List */}
                {isExpanded && (
                    <div className="mt-3 grid gap-2 animate-fadeIn">
                        <p className="text-xs text-slate-400 mb-1 ml-1 px-1">아래 목록에서 식단을 선택해보세요</p>
                        {options.map((food) => (
                            <button
                                key={food.food_id}
                                onClick={() => {
                                    setSelectedFood(food);
                                    setIsExpanded(false);
                                }}
                                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all
                                    ${selectedFood.food_id === food.food_id
                                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">{food.food_name}</span>
                                </div>
                                <span className={`text-xs ${selectedFood.food_id === food.food_id ? "text-purple-100" : "text-slate-500"}`}>
                                    {food.food_calories} kcal
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="card-container">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">오늘의 추천 식단</h2>
                    {loading && <RefreshCw size={16} className="animate-spin text-purple-500" />}
                </div>

                {error ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <AlertCircle size={32} className="text-red-400 mb-2" />
                        <p className="text-slate-600 font-medium whitespace-pre-line">{error}</p>
                        <p className="text-xs text-slate-400 mt-1">서버 연결 상태를 확인해주세요.</p>
                    </div>
                ) : loading && (!mealData.breakfast.length) ? (
                    <div className="py-10 text-center text-slate-400">식단을 불러오는 중...</div>
                ) : (
                    <>
                        <MealSection title="아침" options={mealData.breakfast} />
                        <div className="h-px bg-slate-100 my-4"></div>
                        <MealSection title="점심" options={mealData.lunch} />
                        <div className="h-px bg-slate-100 my-4"></div>
                        <MealSection title="저녁" options={mealData.dinner} />
                        <div className="h-px bg-slate-100 my-4"></div>
                        <MealSection title="간식" options={mealData.snack} />
                    </>
                )}
            </div>
        </section>
    );
}
