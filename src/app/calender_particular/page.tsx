"use client"
import { useState, useEffect } from "react"
import CalendarFull from "@/components/main_calendar_full"
import { Food } from "@/types/food"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useViewport } from "@/context/ViewportContext"

// Mock Data Type
interface DailyMealData {
    breakfast: Food[];
    lunch: Food[];
    dinner: Food[];
    snack: Food[];
}

export default function CalendarParticularPage() {
    const { isMobile } = useViewport();
    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealData, setMealData] = useState<DailyMealData>({
        breakfast: [], lunch: [], dinner: [], snack: []
    });

    // Calculate Totals
    const allFoods = [...mealData.breakfast, ...mealData.lunch, ...mealData.dinner, ...mealData.snack];
    const totalCalories = allFoods.reduce((sum, food) => sum + food.food_calories, 0);
    const totalCarbs = allFoods.reduce((sum, food) => sum + food.food_carbs, 0);
    const totalProteins = allFoods.reduce((sum, food) => sum + food.food_proteins, 0);
    const totalFats = allFoods.reduce((sum, food) => sum + food.food_fats, 0);

    // API Fetch for Selected Date
    useEffect(() => {
        // 날짜 포맷팅 (YYYY-MM-DD)
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const dateString = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];

        // API Call
        fetch(`http://localhost:8000/api/record?date=${dateString}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                setMealData({
                    breakfast: data.breakfast || [],
                    lunch: data.lunch || [],
                    dinner: data.dinner || [],
                    snack: data.snack || []
                });
            })
            .catch(err => {
                console.error("Fetch Error", err);
                setMealData({ breakfast: [], lunch: [], dinner: [], snack: [] });
            });
    }, [selectedDate]);

    // Helper Component for Meal List (Square Card Style)
    const MealGroup = ({ title, foods }: { title: string, foods: Food[] }) => {
        const mealCal = foods.reduce((sum, f) => sum + f.food_calories, 0);

        return (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col h-full min-h-[160px]">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{mealCal} kcal</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {foods.length > 0 ? (
                        <div className="space-y-2">
                            {foods.map(food => (
                                <div key={food.food_id} className="text-sm">
                                    <div className="font-medium text-slate-700 truncate">{food.food_name}</div>
                                    <div className="text-xs text-purple-600">{food.food_calories} kcal</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400">
                            기록 없음
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 max-w-md mx-auto pb-24">
            {/* Header */}
            <header className="mb-6">
                <span className="block text-sm text-slate-500 mb-1">{isMobile ? '모바일' : 'PC'}</span>
                <h1 className="text-xl font-bold text-slate-800">식단 기록 상세</h1>
            </header>

            {/* Full Calendar */}
            <section className="mb-6">
                <CalendarFull
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                // recordedDays={recordedDays} 
                />
            </section>

            {/* Daily Summary (Single Line) */}
            <section className="bg-purple-600 rounded-2xl p-4 text-white mb-6 shadow-lg shadow-purple-200">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-col items-center px-2 border-r border-purple-400/50 flex-1">
                        <span className="text-purple-200 text-xs mb-0.5">총 칼로리</span>
                        <span className="font-bold">{totalCalories} kcal</span>
                    </div>
                    <div className="flex flex-col items-center px-2 border-r border-purple-400/50 flex-1">
                        <span className="text-purple-200 text-xs mb-0.5">탄수화물</span>
                        <span className="font-bold">{totalCarbs}g</span>
                    </div>
                    <div className="flex flex-col items-center px-2 border-r border-purple-400/50 flex-1">
                        <span className="text-purple-200 text-xs mb-0.5">단백질</span>
                        <span className="font-bold">{totalProteins}g</span>
                    </div>
                    <div className="flex flex-col items-center px-2 flex-1">
                        <span className="text-purple-200 text-xs mb-0.5">지방</span>
                        <span className="font-bold">{totalFats}g</span>
                    </div>
                </div>
            </section>

            {/* Meal Lists - 2x2 Grid */}
            <section className="grid grid-cols-2 gap-3">
                <MealGroup title="아침" foods={mealData.breakfast} />
                <MealGroup title="점심" foods={mealData.lunch} />
                <MealGroup title="저녁" foods={mealData.dinner} />
                <MealGroup title="간식" foods={mealData.snack} />
            </section>
        </div>
    );
}
