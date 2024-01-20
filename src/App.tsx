import React, { useState } from 'react';
import './App.css';
import { User, getAuth } from 'firebase/auth';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { SignIn } from './SignIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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

const App = () => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" >
						<Route index element={<SignIn user={user} setUser={setUser}/>} />
						<Route path="*" element={<SignIn user={user} setUser={setUser}/>} />
						<Route path="home" element={<p>HOME</p>} />
					</Route>
				</Routes>
			</BrowserRouter >
		</div>
	);
};

export default App;
