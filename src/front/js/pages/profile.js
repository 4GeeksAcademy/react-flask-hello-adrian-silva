import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Profile = props => {
	const { store, actions } = useContext(Context);
	
	useEffect(() => {
		actions.profile().then(success => {
            if (!success) {
                console.error("No se pudo obtener el perfil del usuario.");
            }
        });
	}, []);

	if (!store.userData) {
        return <p>Loading...</p>;
    }

	return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">User Profile</h1>
            <div className="row">
                <div className="col-12">
                    <div className="bg-info p-4 rounded shadow-sm">
                        <div className="d-flex flex-column">
                            <div className="d-flex">
                                <p className="mb-2 fw-bold">Email:</p>
                                <p className="mb-2 ms-2">{store.userData?.email || 'Loading...'}</p>
                            </div>
                            <div className="d-flex">
                                <p className="mb-2 fw-bold" style={{ minWidth: '80px' }}>ID:</p>
                                <p className="mb-2 ms-2">{store.userData?.id || 'Loading...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};