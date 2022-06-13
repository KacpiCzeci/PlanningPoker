import React, { useEffect } from "react";
import checkToken from "./CheckToken";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import LoadingPage from "../LoadingPage/LoadingPage";


export default function ReqAuthRoute({ element }) {
    const [loading, setLoading] = useState(true);
    const [isTokenOk, setIsTokenOk] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const token = await checkToken();

            setIsTokenOk(token);
            setLoading(false);
        }

        fetchData();
    }, [])

    return (isTokenOk)? element: (loading)? <LoadingPage/>  : <Navigate to="/login" replace/>;
}
