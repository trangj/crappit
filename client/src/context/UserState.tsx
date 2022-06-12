/* eslint-disable react/function-component-definition */
import React, {
  createContext, ReactNode, useContext, useMemo, useState,
} from 'react';
import { User } from 'src/types/entities/user';
import { AxiosResponse } from 'axios';
import axios from '../axiosConfig';

type LoginProps = { username: string; password: string };
type RegisterProps = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

type UserProviderProps = {
  user: User | null;
  logoutUser: () => Promise<void>;
  loginUser: (login: LoginProps) => Promise<AxiosResponse<any>>;
  registerUser: (register: RegisterProps) => Promise<AxiosResponse<any>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserProviderProps>({} as UserProviderProps);

export const UserProvider: React.FC<{
  user: User | null;
  children: ReactNode;
}> = ({ user, children }) => {
  const [current_user, setUser] = useState<User | null>(user);

  async function logoutUser() {
    try {
      await axios.post('/api/user/logout');
      setUser(null);
    } catch (err: any) {
      throw err.response.data;
    }
  }

  async function loginUser(login: LoginProps) {
    try {
      const res = await axios.post('/api/user/login', login);
      setUser(res.data.user);
      return res;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  async function registerUser(register: RegisterProps) {
    try {
      const res = await axios.post('/api/user/register', register);
      setUser(res.data.user);
      return res;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  const value = useMemo(() => ({
    user: current_user,
    loginUser,
    logoutUser,
    registerUser,
    setUser,
  }), [current_user]);

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
