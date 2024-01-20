import React, { useEffect, useState } from 'react';
import { User } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export const Home = (props: {
	user: User | null,
	setUser: (u: User | null) => void
}) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (props.user == null)
			navigate("/");
	}, [props.user]);

	return (<>
	</>);
};