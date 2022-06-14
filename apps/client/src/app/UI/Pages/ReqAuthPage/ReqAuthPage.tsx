import React, { useEffect } from "react";
import checkToken from "./CheckToken";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import LoadingPage from "../LoadingPage/LoadingPage";

export interface ReqAth{
    element: JSX.Element
}

export default function ReqAuthRoute(props: ReqAth): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [isTokenOk, setIsTokenOk] = useState<boolean|undefined>(false);

    useEffect(() => {
        async function fetchData() {
            const token = await checkToken();

            setIsTokenOk(token);
            setLoading(false);
        }

        fetchData();
    }, [])

    return (isTokenOk)? props.element: (loading)? <LoadingPage/> : <Navigate to="/login" replace/>;
}
