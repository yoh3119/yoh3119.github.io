"use client"
import { useState, useEffect } from "react"
import { useViewport } from "@/context/ViewportContext"
import Calendar from "@/components/Main_Calendar"
import MainTodayLikeFood from "@/components/main_today_like_food"
import MainFoodEatInfo from "@/components/main_food_eat_info"
import FloatingCameraButton from "@/components/FloatingCameraButton"
// import { getRandomFood } from "@/components/main_food_dummy_data"

export default function Mainpage() {
  const { isMobile } = useViewport();

  // -- Calendar & Recommendation State --
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [recommendedMeals, setRecommendedMeals] = useState({
    breakfast: [] as any[],
    lunch: [] as any[],
    dinner: [] as any[],
    snack: [] as any[]
  });
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  // -- Image Upload & Daily Record State --
  const [foods, setFoods] = useState<any[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);

  // 1. Handle Calendar Date Selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // 2. Fetch Recommended Meals on Date Change
  useEffect(() => {
    setRecLoading(true);
    setRecError(null);

    const offset = selectedDate.getTimezoneOffset() * 60000;
    const dateString = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];

    fetch(`http://localhost:8000/api/recommendation?date=${dateString}`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 오류");
        return res.json();
      })
      .then((data) => {
        setRecommendedMeals({
          breakfast: data.breakfast || [],
          lunch: data.lunch || [],
          dinner: data.dinner || [],
          snack: data.snack || []
        });
        setRecLoading(false);
      })
      .catch((err) => {
        console.error("API 호출 실패:", err);
        setRecError("데이터를 불러오는데 실패했습니다.");
        setRecommendedMeals({ breakfast: [], lunch: [], dinner: [], snack: [] });
        setRecLoading(false);
      });
  }, [selectedDate]);

  // 3. Handle Image Upload (Mock -> State Update)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      // Mock Upload Delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("이미지 업로드:", file.name);

      alert(`'${file.name}' 업로드 완료! (기능 연동 필요)`);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("오류 발생");
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <header>
        <span style={{ marginLeft: '12px' }}>{isMobile ? '모바일' : 'PC'}</span>
      </header>
      <h1 className="text-xl font-bold text-slate-800">메인</h1>
      <main>
        {/* 달력 (Calendar) */}
        <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

        {/* 오늘의 추천 식단 */}
        <MainTodayLikeFood mealData={recommendedMeals} loading={recLoading} error={recError} />

        {/* 섭취 식단 정보 */}
        <MainFoodEatInfo
          foods={foods}
          totalCalories={totalCalories}
          handleImageUpload={handleImageUpload}
        />

        <FloatingCameraButton />
      </main>
    </>
  );
}
