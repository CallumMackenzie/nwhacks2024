import React, { useState } from 'react';
import "./index.css";
import { User, getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { SignIn } from './SignIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_apiKey,
	authDomain: process.env.REACT_APP_authDomain,
	projectId: process.env.REACT_APP_projectId,
	storageBucket: process.env.REACT_APP_storageBucket,
	messagingSenderId: process.env.REACT_APP_messagingSenderId,
	appId: process.env.REACT_APP_appId,
	measurementId: process.env.REACT_APP_measurementId
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export const theme = createTheme({
	palette: {
		primary: {
			main: "#1EB36C",
			contrastText: "#C3CbCb",
		},
		secondary: {
			main: "#C00F0F",
			contrastText: "#C3CbCb"
		},
		background: {
			default: "#0e1111",
			paper: "#232b2b"
		},
		text: {
			primary: "#C3CbCb",
			secondary: "#F5F5F5",
			disabled: "#FCC8D1"
		},
		divider: "#C3CbCb",
	},
});

const App = () => {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<BrowserRouter>
					<Routes>
						<Route path="/" >
							<Route index element={<SignIn auth={auth} />} />
							<Route path="*" element={<SignIn auth={auth} />} />
							<Route path="home" element={<Home auth={auth} firestore={firestore} />} />
						</Route>
					</Routes>
				</BrowserRouter >
			</ThemeProvider>
		</div>
	);
};

export default App;
