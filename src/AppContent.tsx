import React from "react";
import SearchForm from "./components/SearchForm";
import RepoTable from "./components/RepoTable";
import Pagination from "./components/Pagination";
import { useFetchRepos } from "./hooks/useFetchRepos";
import styles from "./styles/App.module.css";

const AppContent: React.FC = () => {
	useFetchRepos();

	return (
		<div className={styles["app"]}>
			<h1 className={styles["main-title"]}>GitHub Repository Browser</h1>
			<SearchForm />
			<RepoTable />
			<Pagination />
		</div>
	);
};

export default AppContent;
