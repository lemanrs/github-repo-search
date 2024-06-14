import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import styles from "../styles/App.module.css";
import { useNavigate, useParams } from "react-router-dom";

import { useFetchRepos } from "../hooks/useFetchRepos";

const RepoDetails: React.FC = () => {
    const { fetchRepoDetails } = useFetchRepos();

    const { state } = useContext(AppContext);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            fetchRepoDetails(id);
        }
    }, [id]);

    if (!id) return null;

    return (
        <div className={styles["details-main-container"]}>
            <div className={styles["title-container"]}>
                <button className={styles["back-button"]} onClick={handleGoBack}>
                    Back
                </button>
                <h1 className={styles["main-title"]}>Repository Details</h1>
            </div>
            <div>{state?.repoDetails?.full_name}</div>
        </div>
    );
};

export default RepoDetails;
