"use client";

import React from "react";
import FoodCard from "./FoodCard";

interface FoodItem {
  id: string;
  name: string;
  type: string;
  origin: string;
  rating: number;
  description: string;
  imageUrl: string;
  mostIconic?: string;
}

interface FoodListProps {
  foods: FoodItem[];
}

const FoodList: React.FC<FoodListProps> = ({ foods }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods.map((food) => (
        <FoodCard key={food.id} {...food} />
      ))}
    </div>
  );
};

export default FoodList;