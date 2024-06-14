import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import SearchForm from "./components/SearchForm";
import RepoTable from "./components/RepoTable";
import Pagination from "./components/Pagination";
import RepoDetails from "./components/RepoDetails";
import { useFetchRepos } from "./hooks/useFetchRepos";
import styles from "./styles/App.module.css";

const MainPage: React.FC = () => {
	useFetchRepos();
	return (
		<>
			<h1 className={styles["main-title"]}>GitHub Repository Browser</h1>
			<SearchForm />
			<RepoTable />
			<Pagination />
		</>
	);
};
const AppContent: React.FC = () => {
	return (
		<div className={styles["app"]}>
			<Router>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/details/:id" element={<RepoDetails />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Router>
		</div>
	);
};

export default AppContent;
