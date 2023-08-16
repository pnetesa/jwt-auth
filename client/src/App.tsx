import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import LoginForm from './components/login-form';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { User } from './models/user';
import UserService from './services/user-service';

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  if (store.isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button type="button" onClick={getUsers}>Get users (no auth)</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? `User authorized: ${store.user.email}` : `Please authorize`}</h1>
      <h1>{store.user.isActivated ? 'Account activated via e-mail' : 'Please activate account!!!'}</h1>
      <button type="button" onClick={() => store.logout()}>Logout</button>
      <div>
        <button type="button" onClick={getUsers}>Get users</button>
      </div>
      {users.map(user =>
        <div key={user.id}>{user.email}</div>,
      )}
    </div>
  );
}

export default observer(App);
