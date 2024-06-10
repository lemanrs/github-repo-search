import React, { useContext, ReactElement } from "react";
import { AppContext } from "../context/AppContext";
import styles from "../styles/App.module.css";

const Pagination: React.FC = (): ReactElement | null => {
	const { state, dispatch } = useContext(AppContext);

	if (!state.repositories.length) {
		return null;
	}

	const handlePageChange = (page: number) => {
		if (!state.loading) {
			dispatch({ type: "SET_PAGE", payload: page });
		}
	};

	const handleItemsPerPageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const itemsPerPage = parseInt(event.target.value);
		dispatch({ type: "SET_ITEMS_PER_PAGE", payload: itemsPerPage });
		dispatch({ type: "SET_PAGE", payload: 1 });
	};

	const getPageNumbers = (): number[] => {
		const totalPages: number = state.totalPages;
		const currentPage: number = state.currentPage;
		const maxPagesToShow: number = 5;

		let startPage: number;
		let endPage: number;

		if (totalPages <= maxPagesToShow) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= 3) {
				startPage = 1;
				endPage = maxPagesToShow;
			} else if (currentPage >= totalPages - 2) {
				startPage = totalPages - (maxPagesToShow - 1);
				endPage = totalPages;
			} else {
				startPage = currentPage - 1;
				endPage = currentPage + 3;

				if (currentPage === startPage) {
					startPage = Math.max(1, currentPage - 2);
					endPage = startPage + (maxPagesToShow - 1);
				}

				if (currentPage === endPage) {
					endPage = Math.min(totalPages, currentPage + 2);
					startPage = endPage - (maxPagesToShow - 1);
				}
			}
		}

		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i
		);
	};

	const pageNumbers = getPageNumbers();

	return !state.loading ? (
		<div className={styles["pagination-container"]}>
			<div className={styles["items-per-page"]}>
				<label htmlFor="itemsPerPage">Items per page: </label>
				<select
					id="itemsPerPage"
					onChange={handleItemsPerPageChange}
					defaultValue={state.itemsPerPage}
					className={styles["dropdown"]}
				>
					<option value={10}>10</option>
					<option value={30}>30</option>
					<option value={50}>50</option>
				</select>
			</div>
			<div className={styles["pagination"]}>
				{state.currentPage > 1 && (
					<button
						onClick={() => handlePageChange(1)}
						disabled={state.currentPage === 1 || state.loading}
						className={state.currentPage === 1 ? styles["disabled"] : ""}
					>
						First
					</button>
				)}
				{pageNumbers.map((number) => (
					<button
						key={number}
						onClick={() => handlePageChange(number)}
						className={state.currentPage === number ? styles["selected"] : ""}
						disabled={state.loading}
					>
						{number}
					</button>
				))}
				{state.currentPage < state.totalPages && (
					<button
						onClick={() => handlePageChange(state.totalPages)}
						disabled={state.currentPage === state.totalPages || state.loading}
						className={
							state.currentPage === state.totalPages ? styles["disabled"] : ""
						}
					>
						Last
					</button>
				)}
			</div>
		</div>
	) : (
		<></>
	);
};

export default Pagination;
