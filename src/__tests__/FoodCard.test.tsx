import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FoodCard from "@/components/FoodCard";

const mockFood = {
    id: "1",
    name: "Nasi Goreng",
    type: "Makanan",
    origin: "Indonesia",
    rating: 4.5,
    description: "Delicious fried rice.",
    imageUrl: "https://example.com/nasi.jpg",
    mostIconic: undefined,
};

describe("FoodCard component", () => {
    it("renders name and rating", () => {
        render(
            <MemoryRouter>
                <FoodCard {...mockFood} />
            </MemoryRouter>
        );
        expect(screen.getByText(/Nasi Goreng/i)).toBeInTheDocument();
        expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    });
});
