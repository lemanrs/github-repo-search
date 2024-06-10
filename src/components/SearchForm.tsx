import React, { useContext, useReducer } from "react";
import { AppContext } from "../context/AppContext";
import styles from "../styles/App.module.css";
import { data } from "./filterData";

type Child = {
	id: number;
	title: string;
};

type Group = {
	title: string;
	children: Child[];
};

type State = {
	inputValue: string;
	isDropdownOpen: boolean;
	selectedTitle: string;
};

type Action =
	| { type: "SET_INPUT_VALUE"; payload: string }
	| { type: "TOGGLE_DROPDOWN" }
	| { type: "SET_SELECTED_TITLE"; payload: string }
	| { type: "CLEAR_INPUT" };

const initialState: State = {
	inputValue: "",
	isDropdownOpen: false,
	selectedTitle: "",
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_INPUT_VALUE":
			return { ...state, inputValue: action.payload };
		case "TOGGLE_DROPDOWN":
			return { ...state, isDropdownOpen: !state.isDropdownOpen };
		case "SET_SELECTED_TITLE":
			return {
				...state,
				selectedTitle:
					state.selectedTitle === action.payload ? "" : action.payload,
			};
		case "CLEAR_INPUT":
			return { ...state, inputValue: "" };
		default:
			return state;
	}
};

const SearchForm: React.FC = () => {
	const { state: appState, dispatch: appDispatch } = useContext(AppContext);
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleSearch = () => {
		if (state.inputValue.trim().length < 1) return;
		appDispatch({ type: "SET_SEARCH_VALUE", payload: state.inputValue.trim() });
		appDispatch({ type: "SET_PAGE", payload: 1 });
	};

	const findTitleById = (
		data: Group[],
		id: number,
		groupTitle: string
	): string | null => {
		const group = data.find(
			(group) => group.title.toLocaleLowerCase() === groupTitle
		);
		if (group) {
			const found = group.children.find((child: Child) => child.id === id);
			if (found) {
				return found.title;
			}
		}
		return null;
	};

	const handleTypeChange = (endpoint: string, id: number) => {
		let selectedType = findTitleById(data, id, endpoint);
		appDispatch({ type: "SET_TYPE", payload: selectedType });
		appDispatch({ type: "SET_ENDPOINT", payload: endpoint });
		appDispatch({ type: "SET_PAGE", payload: 1 });
		dispatch({ type: "TOGGLE_DROPDOWN" });
	};

	const clearInput = () => {
		dispatch({ type: "CLEAR_INPUT" });
		appDispatch({ type: "SET_SEARCH_VALUE", payload: "" });
		appDispatch({ type: "SET_REPOSITORIES", payload: [] });
		appDispatch({ type: "SET_PAGE", payload: 1 });
		appDispatch({ type: "SET_TOTAL_PAGES", payload: 1 });
		appDispatch({ type: "SET_ITEMS_PER_PAGE", payload: 10 });
	};

	const toggleDropdown = () => {
		dispatch({ type: "TOGGLE_DROPDOWN" });
	};

	const handleTitleClick = (title: string) => {
		dispatch({ type: "SET_SELECTED_TITLE", payload: title });
	};

	return (
		<div className={styles["search-container"]}>
			<div className={styles["search-row"]}>
				<div
					className={`${styles["dropdown-container"]} ${
						state.isDropdownOpen ? styles["open"] : ""
					}`}
				>
					<div className={styles["dropdown"]} onClick={toggleDropdown}>
						<h4 className={styles["dropdown-title"]}>
							{/* {appState?.endpoint && appState?.type
								? appState?.endpoint + "-" + appState?.type
								: "Select Type"}
							{appState?.endpoint ? appState?.endpoint : "Select Type"} */}
							{appState?.endpoint && appState?.type
								? `${appState.endpoint}-${appState.type}`
								: appState?.endpoint
								? appState.endpoint
								: "Select Type"}
						</h4>
					</div>
					<div className={styles["dropdown-content"]}>
						{data.map((item) => (
							<div
								key={item.title}
								className={styles["dropdown-item"]}
								onClick={() => handleTitleClick(item.title)}
							>
								<div className={styles["title"]}>{item.title}</div>

								{state.selectedTitle === item.title &&
									item.children.map((child) => (
										<div
											key={child.id}
											className={styles["dropdown-child"]}
											onClick={() =>
												handleTypeChange(item.title.toLowerCase(), child.id)
											}
										>
											{child.title}
										</div>
									))}
							</div>
						))}
					</div>
				</div>

				<div className={styles["search-bar-container"]}>
					<input
						className={styles["search-bar"]}
						type="text"
						placeholder="Enter GitHub username or organization"
						value={state.inputValue}
						onChange={(e) =>
							dispatch({ type: "SET_INPUT_VALUE", payload: e.target.value })
						}
					/>
					{state.inputValue && (
						<span className={styles["clear-button"]} onClick={clearInput}>
							×
						</span>
					)}
				</div>
				<button
					className={styles["search-button"]}
					onClick={handleSearch}
					disabled={appState.loading}
				>
					Search
				</button>
			</div>
		</div>
	);
};

export default SearchForm;
