import React, { useState, createContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authEvents from '../authEvents';
import { UserContextType } from '../types/userContextTypes';
import { useLogout } from '../hooks/useLogout';
import { Logger } from 'mayo-logger';

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userContextLoading, setUserContextLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      Logger.info("Attempting to fetch user from AsyncStorage.", null, {tag: 'mayo-firebase-auth'});

      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          Logger.info("User found in AsyncStorage.", { storedUser: JSON.parse(storedUser) }, {tag: 'mayo-firebase-auth'});
          setUser(JSON.parse(storedUser));
        } else {
          Logger.warn("No user found in AsyncStorage.", null, {tag: 'mayo-firebase-auth'});
        }
      } catch (error) {
        Logger.error("Error fetching user from AsyncStorage.", error, {tag: 'mayo-firebase-auth'});
      } finally {
        setUserContextLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, useLogout, authEvents, userContextLoading }}>
      {children}
    </UserContext.Provider>
  );
};
