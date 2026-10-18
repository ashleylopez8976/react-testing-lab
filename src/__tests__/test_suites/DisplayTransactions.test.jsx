import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";

describe("Displaying transactions", () => {
  it("displays transaction details when the app starts", async () => {
    globalThis.setFetchResponse([
      {
        id: 1,
        date: "2026-10-01",
        description: "Grocery shopping",
        category: "Food",
        amount: -45,
      },
      {
        id: 2,
        date: "2026-10-02",
        description: "Monthly paycheck",
        category: "Income",
        amount: 2000,
      },
    ]);

    render(<AccountContainer />);

    const grocery = await screen.findByText("Grocery shopping");
    const groceryRow = within(grocery.closest("tr"));

    expect(groceryRow.getByText("2026-10-01")).toBeInTheDocument();
    expect(groceryRow.getByText("Food")).toBeInTheDocument();
    expect(groceryRow.getByText("-45")).toBeInTheDocument();

    const paycheckRow = within(
      screen.getByText("Monthly paycheck").closest("tr")
    );

    expect(paycheckRow.getByText("2026-10-02")).toBeInTheDocument();
    expect(paycheckRow.getByText("Income")).toBeInTheDocument();
    expect(paycheckRow.getByText("2000")).toBeInTheDocument();

    // One heading row plus two transaction rows.
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });
});