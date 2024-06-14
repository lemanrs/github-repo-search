import { Octokit } from "@octokit/rest";
import { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

const octokit = new Octokit({
	auth: process.env.REACT_APP_GITHUB_TOKEN,
});

interface Links {
	[key: string]: string;
}

type ErrorResponse = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

const isErrorResponse = (error: any): error is ErrorResponse => {
	return (
		error &&
		error.response &&
		error.response.data &&
		typeof error.response.data.message === "string"
	);
};

export const useFetchRepos = () => {
	const { state, dispatch } = useContext(AppContext);

	const fetchRepos = async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		const endpoint = state.endpoint === "organization" ? "orgs" : "users";

		try {
			const response = await octokit.request(
				`GET /${endpoint}/{searchValue}/repos`,
				{
					searchValue: state.searchValue,
					page: state.currentPage,
					per_page: state.itemsPerPage,
					sort: state.sortKey,
					direction: state.sortDirection,
					type: state.type,
				}
			);

			const linkHeader = response.headers.link;
			let totalPages = 1;
			if (linkHeader) {
				const links: Links = linkHeader.split(",").reduce((acc, link) => {
					const [url, rel] = link.split(";").map((part) => part.trim());
					const pageMatch = url.match(/page=(\d+)/);
					if (pageMatch) {
						const pageNumber = pageMatch[1];
						if (rel.includes("last")) {
							acc["last"] = pageNumber;
						}
						if (rel.includes("prev")) {
							acc["prev"] = pageNumber;
						}
					}
					return acc;
				}, {} as Links);

				if (links.last) {
					totalPages = parseInt(links.last, 10);
				} else if (links.prev) {
					totalPages = parseInt(links.prev, 10) + 1;
				}
			}

			dispatch({ type: "SET_REPOSITORIES", payload: response.data });
			dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
			dispatch({ type: "SET_ERROR", payload: "" });
		} catch (error) {
			dispatch({ type: "SET_REPOSITORIES", payload: [] });
			if (isErrorResponse(error)) {
				dispatch({
					type: "SET_ERROR",
					payload: error?.response?.data?.message,
				});
			} else {
				dispatch({ type: "SET_ERROR", payload: "An unknown error occurred" });
			}
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	};

	const fetchRepoDetails = async (id: string) => {
		dispatch({ type: "SET_LOADING", payload: true });

		try {
			const response = await octokit.request("GET /repositories/{repo_id}", {
				repo_id: Number(id),
			});
			dispatch({ type: "SET_REPO_DETAILS", payload: response.data });
		} catch (error) {
			dispatch({ type: "SET_REPO_DETAILS", payload: {} });
			if (isErrorResponse(error)) {
				dispatch({
					type: "SET_ERROR",
					payload: error?.response?.data?.message,
				});
			} else {
				dispatch({ type: "SET_ERROR", payload: "An unknown error occurred" });
			}
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	};

	useEffect(() => {
		if (state.searchValue) {
			fetchRepos();
		}
	}, [
		state.searchValue,
		state.currentPage,
		state.sortKey,
		state.sortDirection,
		state.type,
		state.itemsPerPage,
	]);

	return { fetchRepos, fetchRepoDetails };
};
