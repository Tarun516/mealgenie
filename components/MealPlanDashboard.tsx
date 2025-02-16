// components/MealPlanDashboard.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "./Spinner";

// Define an interface for a single meal
interface Meal {
  name: string;
  description: string;
  calories: number;
  ingredients: string[];
}

// Define a day’s meal plan
interface DayMealPlan {
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  snacks?: Meal[]; // snacks is an array of meals if provided
}

// The API response shape
interface MealPlanResponse {
  mealPlan?: {
    [day: string]: DayMealPlan;
  };
  error?: string;
}

interface MealPlanInput {
  dietType: string;
  calories: number;
  allergies: string;
  cuisine: string;
  snacks: boolean;
}

export default function MealPlanDashboard() {
  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState<number>(2000);
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [snacks, setSnacks] = useState(false);

  // Initialize the mutation using React Query
  const mutation = useMutation<MealPlanResponse, Error, MealPlanInput>({
    mutationFn: async (payload: MealPlanInput) => {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData: MealPlanResponse = await response.json();
        throw new Error(errorData.error || "Failed to generate meal plan.");
      }
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ dietType, calories, allergies, cuisine, snacks });
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-4">Meal Plan Generator</h1>
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
        <input
          type="text"
          placeholder="Diet Type (e.g., Vegetarian)"
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Calories (e.g., 2000)"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Allergies (or 'none')"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Preferred Cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={snacks}
              onChange={(e) => setSnacks(e.target.checked)}
            />{" "}
            Include Snacks
          </label>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Generate Meal Plan
        </button>
      </form>

      {mutation.status === "pending" && (
        <div className="mt-4">
          <Spinner />
        </div>
      )}

      {mutation.status === "error" && (
        <div className="mt-4 text-red-500">{mutation.error?.message}</div>
      )}

      {mutation.status === "success" && mutation.data.mealPlan && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {Object.entries(mutation.data.mealPlan).map(([day, meals]) => (
            <div key={day} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-bold mb-2">{day}</h2>
              {meals.breakfast && (
                <div className="mb-2">
                  <div className="font-semibold">
                    Breakfast: {meals.breakfast.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {meals.breakfast.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    Calories: {meals.breakfast.calories}
                  </div>
                  {meals.breakfast.ingredients && (
                    <div className="text-xs text-gray-500">
                      Ingredients: {meals.breakfast.ingredients.join(", ")}
                    </div>
                  )}
                </div>
              )}
              {meals.lunch && (
                <div className="mb-2">
                  <div className="font-semibold">Lunch: {meals.lunch.name}</div>
                  <div className="text-sm text-gray-700">
                    {meals.lunch.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    Calories: {meals.lunch.calories}
                  </div>
                  {meals.lunch.ingredients && (
                    <div className="text-xs text-gray-500">
                      Ingredients: {meals.lunch.ingredients.join(", ")}
                    </div>
                  )}
                </div>
              )}
              {meals.dinner && (
                <div className="mb-2">
                  <div className="font-semibold">
                    Dinner: {meals.dinner.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {meals.dinner.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    Calories: {meals.dinner.calories}
                  </div>
                  {meals.dinner.ingredients && (
                    <div className="text-xs text-gray-500">
                      Ingredients: {meals.dinner.ingredients.join(", ")}
                    </div>
                  )}
                </div>
              )}
              {meals.snacks && Array.isArray(meals.snacks) && (
                <div className="mb-2">
                  <div className="font-semibold">Snacks:</div>
                  {meals.snacks.map((snack, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      <span className="font-medium">{snack.name}</span> -{" "}
                      {snack.description} ({snack.calories} calories)
                      {snack.ingredients && (
                        <span className="text-xs text-gray-500">
                          ; Ingredients: {snack.ingredients.join(", ")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
