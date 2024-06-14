import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination";
import { AppContext, AppState } from "../../context/AppContext";

const mockState: AppState = {
  repositories: [{ id: 1, name: "Repo 1" }], // Example data
  loading: false,
  currentPage: 1,
  totalPages: 5,
  itemsPerPage: 10,
  searchValue: "",
  error: null,
  type: "repository",
  endpoint: "/api/repositories",
  sortKey: "",
  sortDirection: "",
  repoDetails:{}
};

const mockDispatch = jest.fn();

const renderPagination = (state = mockState) => {
  return render(
    <AppContext.Provider value={{ state, dispatch: mockDispatch }}>
      <Pagination />
    </AppContext.Provider>
  );
};

test("renders Pagination component", () => {
  renderPagination();
  expect(screen.getByText("Items per page:")).toBeInTheDocument();

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(6); // 5 page numbers + "Last" button

  expect(buttons[0]).toHaveTextContent("1");
  expect(buttons[1]).toHaveTextContent("2");
  expect(buttons[2]).toHaveTextContent("3");
  expect(buttons[3]).toHaveTextContent("4");
  expect(buttons[4]).toHaveTextContent("5");
  expect(buttons[5]).toHaveTextContent("Last");
});

test("renders Pagination component with selected page", () => {
  renderPagination();
  const selectedButton = screen.getByRole("button", { name: "1" });
  expect(selectedButton).toHaveClass("selected");
});

test('renders "Items per page" dropdown correctly', () => {
  renderPagination();
  const dropdown = screen.getByRole("combobox");
  expect(dropdown).toBeInTheDocument();

  const options = screen.getAllByRole("option");
  expect(options).toHaveLength(3);

  expect(options[0]).toHaveTextContent("10");
  expect(options[1]).toHaveTextContent("30");
  expect(options[2]).toHaveTextContent("50");
});

test("handles page change correctly", () => {
  renderPagination();

  const button2 = screen.getByRole("button", { name: "2" });
  fireEvent.click(button2);

  expect(mockDispatch).toHaveBeenCalledWith({ type: "SET_PAGE", payload: 2 });
});

test('handles "Last" button click correctly', () => {
  renderPagination();

  const lastButton = screen.getByRole("button", { name: "Last" });
  fireEvent.click(lastButton);

  expect(mockDispatch).toHaveBeenCalledWith({ type: "SET_PAGE", payload: 5 });
});

test('handles "Items per page" change correctly', () => {
  renderPagination();

  const dropdown = screen.getByRole("combobox");
  fireEvent.change(dropdown, { target: { value: "30" } });

  expect(mockDispatch).toHaveBeenCalledWith({
    type: "SET_ITEMS_PER_PAGE",
    payload: 30,
  });
  expect(mockDispatch).toHaveBeenCalledWith({ type: "SET_PAGE", payload: 1 });
});

test("does not render buttons when loading", () => {
  const loadingState: AppState = { ...mockState, loading: true };
  renderPagination(loadingState);

  const buttons = screen.queryAllByRole("button");
  expect(buttons).toHaveLength(0); // No buttons should be rendered
});
