import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../../components/Search";
import Sort from "../../components/Sort";
import AccountContainer from "../../components/AccountContainer";

describe("Search and sort controls", () => {
  it("passes the entered search text to setSearch", async () => {
    const user = userEvent.setup();
    const setSearch = vi.fn();

    render(<Search setSearch={setSearch} />);

    await user.type(
      screen.getByPlaceholderText("Search your Recent Transactions"),
      "coffee"
    );

    expect(setSearch).toHaveBeenLastCalledWith("coffee");
  });

  it("passes the selected category option to onSort", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(<Sort onSort={onSort} />);

    await user.selectOptions(screen.getByRole("combobox"), "category");

    expect(onSort).toHaveBeenCalledWith("category");
  });
});

describe("Searching transactions", () => {
  it("shows matching transactions and hides nonmatching ones", async () => {
    const user = userEvent.setup();

    globalThis.setFetchResponse([
      {
        id: 1,
        date: "2026-10-01",
        description: "Coffee shop",
        category: "Food",
        amount: -5,
      },
      {
        id: 2,
        date: "2026-10-02",
        description: "Electric bill",
        category: "Utilities",
        amount: -100,
      },
    ]);

    render(<AccountContainer />);

    expect(await screen.findByText("Coffee shop")).toBeInTheDocument();
    expect(screen.getByText("Electric bill")).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText("Search your Recent Transactions"),
      "COFFEE"
    );

    expect(screen.getByText("Coffee shop")).toBeInTheDocument();
    expect(screen.queryByText("Electric bill")).not.toBeInTheDocument();
  });
});

describe("Sorting transactions", () => {
  it("sorts transactions by category and then description", async () => {
    const user = userEvent.setup();

    globalThis.setFetchResponse([
      {
        id: 1,
        date: "2026-10-01",
        description: "Apple purchase",
        category: "Shopping",
        amount: -20,
      },
      {
        id: 2,
        date: "2026-10-02",
        description: "Zebra cafe",
        category: "Food",
        amount: -10,
      },
    ]);

    render(<AccountContainer />);

    await screen.findByText("Apple purchase");

    await user.selectOptions(screen.getByRole("combobox"), "category");

    let rows = screen.getAllByRole("row").slice(1);

    expect(rows[0]).toHaveTextContent("Zebra cafe");
    expect(rows[1]).toHaveTextContent("Apple purchase");

    await user.selectOptions(screen.getByRole("combobox"), "description");

    rows = screen.getAllByRole("row").slice(1);

    expect(rows[0]).toHaveTextContent("Apple purchase");
    expect(rows[1]).toHaveTextContent("Zebra cafe");
  });
});