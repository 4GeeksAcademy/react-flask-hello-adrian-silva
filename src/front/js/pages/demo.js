import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Register = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container">
			<Link to={"/"}>
				<span>Link to: {item.title}</span>
			</Link>
		</div>
	);
};
