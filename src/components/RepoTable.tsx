import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import styles from "../styles/App.module.css";
import { useNavigate } from "react-router-dom";

const RepoTable: React.FC = () => {
	const { state, dispatch } = useContext(AppContext);

	const navigate = useNavigate();

	const handleSort = (key: string) => {
		const isAsc = state.sortKey === key && state.sortDirection === "asc";
		dispatch({ type: "SET_SORT_KEY", payload: key });
		dispatch({ type: "SET_SORT_DIRECTION", payload: isAsc ? "desc" : "asc" });
	};

	const getArrow = (key: string) => {
		if (state.sortKey === key) {
			return state.sortDirection === "asc" ? "↓" : "↑";
		}
		return "↕"; // Default arrow indicating sortability
	};

	useEffect(() => {
		if (!state.sortKey) {
			dispatch({ type: "SET_SORT_KEY", payload: "full_name" });
			dispatch({ type: "SET_SORT_DIRECTION", payload: "asc" });
		}
	}, [dispatch, state.sortKey]);

	if (state.loading) {
		return <div className={styles["loading"]}>Loading...</div>;
	}

	if (!state.repositories.length && !state.error) {
		return (
			<div className={styles["no-data"]}>No Available Data to Display.</div>
		);
	}

	if (state.error) {
		return <div className={styles["no-data"]}>{state.error}.</div>;
	}

	const handleOpenDetails = (id: number) => {
		navigate(`/details/${id}`);
	};

	return (
		<div className={styles["table-container"]}>
			<table className={styles["table"]}>
				<thead>
					<tr>
						<th onClick={() => handleSort("full_name")}>
							Name{" "}
							<span className={styles["arrow"]}>{getArrow("full_name")}</span>
						</th>
						<th>Description</th>
						<th onClick={() => handleSort("created")}>
							Created{" "}
							<span className={styles["arrow"]}>{getArrow("created")}</span>
						</th>
						<th onClick={() => handleSort("updated")}>
							Updated{" "}
							<span className={styles["arrow"]}>{getArrow("updated")}</span>
						</th>
						<th onClick={() => handleSort("pushed")}>
							Pushed{" "}
							<span className={styles["arrow"]}>{getArrow("pushed")}</span>
						</th>
						<th>URL</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{state.repositories.map((repo) => (
						<tr key={repo.id}>
							<td>{repo.name}</td>
							<td>{repo.description}</td>
							<td>{new Date(repo.created_at).toLocaleDateString()}</td>
							<td>{new Date(repo.updated_at).toLocaleDateString()}</td>
							<td>{new Date(repo.pushed_at).toLocaleDateString()}</td>
							<td onClick={() => window.open(repo.html_url, "_blank")}>
								{repo.html_url}
							</td>
							<td onClick={() => handleOpenDetails(repo.id)}>View</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RepoTable;
