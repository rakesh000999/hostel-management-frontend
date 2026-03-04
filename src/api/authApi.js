// How to use AuthContext in your components:
/*
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, token, login, logout, register, error } = useContext(AuthContext);

  // Use it like:
  if (!isAuthenticated) {
    return <p>Please login first</p>;
  }

  return <div>Welcome, {user.name}!</div>;
};
*/

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  STUDENTS: {
    LIST: "/students",
    CREATE: "/students",
    GET: (id) => `/students/${id}`,
    UPDATE: (id) => `/students/${id}`,
    DELETE: (id) => `/students/${id}`,
  },
  ROOMS: {
    LIST: "/rooms",
    CREATE: "/rooms",
    GET: (id) => `/rooms/${id}`,
    UPDATE: (id) => `/rooms/${id}`,
    DELETE: (id) => `/rooms/${id}`,
  },
  FEES: {
    LIST: "/fees",
    CREATE: "/fees",
    GET: (id) => `/fees/${id}`,
    UPDATE: (id) => `/fees/${id}`,
    DELETE: (id) => `/fees/${id}`,
  },
};

// Example of using API with AuthContext:
/*
import api from './axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const getStudents = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.STUDENTS.LIST);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

const createStudent = async (studentData) => {
  try {
    const response = await api.post(API_ENDPOINTS.STUDENTS.CREATE, studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};
*/
