import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountContainer from "../../components/AccountContainer";

describe("Adding transactions", () => {
  it("sends a POST request and displays the saved transaction", async () => {
    const user = userEvent.setup();

    const newTransaction = {
      date: "2026-10-17",
      description: "Book purchase",
      category: "Education",
      amount: "-25",
    };

    // The first response loads transactions; the second saves the new one.
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        json: async () => [],
      })
      .mockResolvedValueOnce({
        json: async () => ({
          ...newTransaction,
          id: 3,
        }),
      });

    const { container } = render(<AccountContainer />);

    // Wait for the initial transaction request to finish.
    await screen.findByRole("columnheader", { name: "Date" });
    await user.type(
      screen.getByPlaceholderText("Description"),
      newTransaction.description
    );
    await user.type(
      screen.getByPlaceholderText("Category"),
      newTransaction.category
    );
    await user.type(
      screen.getByPlaceholderText("Amount"),
      newTransaction.amount
    );

    fireEvent.change(container.querySelector('input[name="date"]'), {
      target: { value: newTransaction.date },
    });

    await user.click(
      screen.getByRole("button", { name: "Add Transaction" })
    );

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:6001/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      }
    );

    expect(await screen.findByText("Book purchase")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("-25")).toBeInTheDocument();
  });
});