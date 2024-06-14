import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppContext, AppState } from "../../context/AppContext";
import SearchForm from "../SearchForm";
import { data } from "../filterData";

// Mock data
const mockAppState: AppState = {
	loading: false,
	endpoint: "",
	type: "",
	currentPage: 1,
	totalPages: 1,
	itemsPerPage: 10,
	searchValue: "",
	repositories: [],
	error: null,
	sortKey: "full_name",
	sortDirection: "asc",
	repoDetails:{}
};

const mockDispatch = jest.fn();

describe("SearchForm", () => {
	beforeEach(() => {
		mockDispatch.mockClear();
	});

	test("renders the SearchForm component", () => {
		render(
			<AppContext.Provider
				value={{ state: mockAppState, dispatch: mockDispatch }}
			>
				<SearchForm />
			</AppContext.Provider>
		);
		expect(
			screen.getByPlaceholderText("Enter GitHub username or organization")
		).toBeInTheDocument();
		expect(screen.getByText("Select Type")).toBeInTheDocument();
		expect(screen.getByText("Search")).toBeInTheDocument();
	});

	test("handles input change", () => {
		render(
			<AppContext.Provider
				value={{ state: mockAppState, dispatch: mockDispatch }}
			>
				<SearchForm />
			</AppContext.Provider>
		);

		const input = screen.getByPlaceholderText(
			"Enter GitHub username or organization"
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "test-user" } });
		expect(input.value).toBe("test-user");
	});

	test("handles search button click", () => {
		render(
			<AppContext.Provider
				value={{ state: mockAppState, dispatch: mockDispatch }}
			>
				<SearchForm />
			</AppContext.Provider>
		);

		const input = screen.getByPlaceholderText(
			"Enter GitHub username or organization"
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "test-user" } });

		const searchButton = screen.getByText("Search");
		fireEvent.click(searchButton);

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_SEARCH_VALUE",
			payload: "test-user",
		});
		expect(mockDispatch).toHaveBeenCalledWith({ type: "SET_PAGE", payload: 1 });
	});

	test("toggles dropdown", () => {
		render(
			<AppContext.Provider
				value={{ state: mockAppState, dispatch: mockDispatch }}
			>
				<SearchForm />
			</AppContext.Provider>
		);

		const dropdown = screen.getByText("Select Type");
		fireEvent.click(dropdown);

		// Ensure the dropdown items are displayed
		data.forEach((item) => {
			expect(screen.getByText(item.title)).toBeInTheDocument();
		});
	});

	test("handles dropdown item selection", () => {
		render(
			<AppContext.Provider
				value={{ state: mockAppState, dispatch: mockDispatch }}
			>
				<SearchForm />
			</AppContext.Provider>
		);

		const dropdown = screen.getByText("Select Type");
		fireEvent.click(dropdown);

		const firstGroup = data[0];
		const firstChild = firstGroup.children[0];
		fireEvent.click(screen.getByText(firstGroup.title));
		fireEvent.click(screen.getByText(firstChild.title));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_TYPE",
			payload: firstChild.title,
		});
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_ENDPOINT",
			payload: firstGroup.title.toLowerCase(),
		});
		expect(mockDispatch).toHaveBeenCalledWith({ type: "SET_PAGE", payload: 1 });
	});

	test("clears input when clear button is clicked", () => {
		render(
			<AppContext.Provider
				value={{ state: mockAppState, dispatch: mockDispatch }}
			>
				<SearchForm />
			</AppContext.Provider>
		);

		const input = screen.getByPlaceholderText(
			"Enter GitHub username or organization"
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "test-user" } });

		const clearButton = screen.getByText("×");
		fireEvent.click(clearButton);

		expect(input.value).toBe("");
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_SEARCH_VALUE",
			payload: "",
		});
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_REPOSITORIES",
			payload: [],
		});
		expect(mockDispatch).toHaveBeenCalledWith({ type: "SET_PAGE", payload: 1 });
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_TOTAL_PAGES",
			payload: 1,
		});
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_ITEMS_PER_PAGE",
			payload: 10,
		});
	});
});
