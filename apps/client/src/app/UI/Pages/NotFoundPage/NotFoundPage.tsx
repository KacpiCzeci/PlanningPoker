import React from "react";
import "./NotFoundPage.scss";

export default function NotFoundPage() {
    return(
        <div className="NotFoundPage-container">
            <div className="NotFoundPage-subcontainer">
                <div className="NotFoundPage-title">
                    <p className="NotFoundPage-p1">404</p>
                </div>
                <div className="NotFoundPage-text">
                    <p className="NotFoundPage-p2">NOT FOUND</p>
                </div>
            </div>
        </div>
    )
}