import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import './App.css';

import axios from 'axios';

class App extends React.Component {
	state = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		alert: null,
	};

	// search github users
	searchUsers = async (text) => {
		this.setState({ loading: true });
		const options = {
			auth: {
				username: process.env.REACT_APP_GITHUB_CLIENT_ID,
				password: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
			},
		};

		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}`,
			options
		);

		this.setState({ users: res.data.items, loading: false });
	};

	// Get a single github user
	getUser = async (username) => {
		this.setState({ loading: true });
		const options = {
			auth: {
				username: process.env.REACT_APP_GITHUB_CLIENT_ID,
				password: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
			},
		};

		const res = await axios.get(
			`https://api.github.com/users/${username}`,
			options
		);

		this.setState({ user: res.data, loading: false });
	};

	// Get a github user repos
	getUserRepos = async (username) => {
		this.setState({ loading: true });
		const options = {
			auth: {
				username: process.env.REACT_APP_GITHUB_CLIENT_ID,
				password: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
			},
		};

		const res = await axios.get(
			`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
			options
		);

		this.setState({ repos: res.data, loading: false });
	};

	// Clear Users from state
	clearUsers = () => {
		this.setState({ users: [], loading: false });
	};

	// create an alert
	setAlert = (msg, type) => {
		this.setState({ alert: { msg, type } });

		setTimeout(() => this.setState({ alert: null }), 3000);
	};

	render() {
		const { users, loading, user, repos } = this.state;

		return (
			<Router>
				<div className='App'>
					<Navbar />
					<div className='container'>
						<Alert alert={this.state.alert} />
						<Switch>
							<Route
								exact
								path='/'
								render={(props) => (
									<Fragment>
										<Search
											searchUsers={this.searchUsers}
											clearUsers={this.clearUsers}
											showClear={users.length > 0 ? true : false}
											setAlert={this.setAlert}
										/>
										<Users loading={loading} users={users} />
									</Fragment>
								)}
							/>
							<Route exact path='/about' component={About} />
							<Route
								exact
								path='/user/:login'
								render={(props) => (
									<User
										{...props}
										getUser={this.getUser}
										getUserRepos={this.getUserRepos}
										repos={repos}
										user={user}
										loading={loading}
									/>
								)}
							/>
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
