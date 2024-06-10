import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppContext } from "../../context/AppContext";
import RepoTable from "../RepoTable";

// Mock data
const mockState = {
	loading: false,
	repositories: [
		{
			id: 1,
			name: "repo1",
			description: "This is repo1",
			created_at: "2023-04-01T10:00:00Z",
			updated_at: "2023-04-02T12:00:00Z",
			pushed_at: "2023-04-03T14:00:00Z",
			html_url: "https://example.com/repo1",
		},
		{
			id: 2,
			name: "repo2",
			description: "This is repo2",
			created_at: "2023-04-05T10:00:00Z",
			updated_at: "2023-04-06T12:00:00Z",
			pushed_at: "2023-04-07T14:00:00Z",
			html_url: "https://example.com/repo2",
		},
	],
	sortKey: "full_name",
	sortDirection: "asc",
	error: null,
	currentPage: 1,
	totalPages: 1,
	itemsPerPage: 10,
	searchValue: "",
	type: "repository",
	endpoint: "/api/repositories",
};

const mockDispatch = jest.fn();

describe("RepoTable", () => {
	beforeEach(() => {
		mockDispatch.mockClear();
	});

	test("renders loading state", () => {
		const { getByText } = render(
			<AppContext.Provider
				value={{
					state: { ...mockState, loading: true },
					dispatch: mockDispatch,
				}}
			>
				<RepoTable />
			</AppContext.Provider>
		);
		expect(getByText("Loading...")).toBeInTheDocument();
	});

	test("renders no data message", () => {
		const { getByText } = render(
			<AppContext.Provider
				value={{
					state: { ...mockState, repositories: [] },
					dispatch: mockDispatch,
				}}
			>
				<RepoTable />
			</AppContext.Provider>
		);
		expect(getByText("No Available Data to Display.")).toBeInTheDocument();
	});

	test("renders error message", () => {
		const { getByText } = render(
			<AppContext.Provider
				value={{
					state: { ...mockState, error: "Error fetching data" },
					dispatch: mockDispatch,
				}}
			>
				<RepoTable />
			</AppContext.Provider>
		);
		expect(getByText("Error fetching data.")).toBeInTheDocument();
	});

	test("renders repositories", () => {
		render(
			<AppContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
				<RepoTable />
			</AppContext.Provider>
		);
		expect(screen.getAllByRole("row")).toHaveLength(
			mockState.repositories.length + 1
		); // +1 for header row
		expect(screen.getByText("repo1")).toBeInTheDocument();
		expect(screen.getByText("This is repo1")).toBeInTheDocument();
		expect(screen.getByText("4/1/2023")).toBeInTheDocument(); // Created date
		expect(screen.getByText("4/2/2023")).toBeInTheDocument(); // Updated date
		expect(screen.getByText("4/3/2023")).toBeInTheDocument(); // Pushed date
		expect(screen.getByText("https://example.com/repo1")).toBeInTheDocument();
	});

	test("sorts repositories by name", () => {
		render(
			<AppContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
				<RepoTable />
			</AppContext.Provider>
		);
		const nameHeader = screen.getByText("Name");
		fireEvent.click(nameHeader);
		expect(mockDispatch).toHaveBeenNthCalledWith(1, {
			type: "SET_SORT_KEY",
			payload: "full_name",
		});
		expect(mockDispatch).toHaveBeenNthCalledWith(2, {
			type: "SET_SORT_DIRECTION",
			payload: "desc",
		});
	});

	test("sorts repositories by created date", () => {
		render(
			<AppContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
				<RepoTable />
			</AppContext.Provider>
		);
		const createdHeader = screen.getByText("Created");
		fireEvent.click(createdHeader);
		expect(mockDispatch).toHaveBeenNthCalledWith(1, {
			type: "SET_SORT_KEY",
			payload: "created",
		});
		expect(mockDispatch).toHaveBeenNthCalledWith(2, {
			type: "SET_SORT_DIRECTION",
			payload: "asc",
		});
	});

	test("sorts repositories by updated date", () => {
		render(
			<AppContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
				<RepoTable />
			</AppContext.Provider>
		);
		const updatedHeader = screen.getByText("Updated");
		fireEvent.click(updatedHeader);
		expect(mockDispatch).toHaveBeenNthCalledWith(1, {
			type: "SET_SORT_KEY",
			payload: "updated",
		});
		expect(mockDispatch).toHaveBeenNthCalledWith(2, {
			type: "SET_SORT_DIRECTION",
			payload: "asc",
		});
	});

	test("sorts repositories by pushed date", () => {
		render(
			<AppContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
				<RepoTable />
			</AppContext.Provider>
		);
		const pushedHeader = screen.getByText("Pushed");
		fireEvent.click(pushedHeader);
		expect(mockDispatch).toHaveBeenNthCalledWith(1, {
			type: "SET_SORT_KEY",
			payload: "pushed",
		});
		expect(mockDispatch).toHaveBeenNthCalledWith(2, {
			type: "SET_SORT_DIRECTION",
			payload: "asc",
		});
	});

	test("opens repository URL in a new tab", () => {
		const openMock = jest.fn();
		window.open = openMock;
		render(
			<AppContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
				<RepoTable />
			</AppContext.Provider>
		);
		const repoUrl = screen.getByText("https://example.com/repo1");
		fireEvent.click(repoUrl);
		expect(openMock).toHaveBeenCalledWith(
			"https://example.com/repo1",
			"_blank"
		);
	});
});
