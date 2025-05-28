import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Access from './pages/Access';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './styles/index.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LoginRegisterForm from './pages/LoginRegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import useIdleTimeout from './hooks/useIdleTimeout';

function App() {
  const [users, setUsers] = useState([]);
  const [usersHome, setUsersHome] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [doors, setDoors] = useState([]);
  const [access, setAccess] = useState([]);
  const [accessTest, setAccessTest] = useState([]);
  const [permission, setPermission] = useState([]);
  const [permissionUser, setPermissionUser] = useState([]);
  const [accessLog, setAccessLog] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info("Sessão expirada, faça login novamente.");
    navigate('/');
  };

  const fetchInitialData = async () => {
    const endpoints = [
      { url: "https://securepass-api-6arh.onrender.com/user/", setter: setUsers },
      { url: "https://securepass-api-6arh.onrender.com/userHome/", setter: setUsersHome },
      { url: "https://securepass-api-6arh.onrender.com/door/", setter: setDoors },
      { url: "https://securepass-api-6arh.onrender.com/access/", setter: setAccess },
      { url: "https://securepass-api-6arh.onrender.com/accessTest/", setter: setAccessTest },
      { url: "https://securepass-api-6arh.onrender.com/permission/", setter: setPermission },
    ];

    try {
      await Promise.all(
        endpoints.map(async ({ url, setter }) => {
          const response = await axios.get(url);
          setter(response.data);
        })
      );
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      toast.error("Erro ao carregar dados iniciais");
    }
  };

  const fetchData = useCallback(async (userID) => {
    try {
      const [userInfoRes, accessLogRes, permissionsUserRes] = await Promise.all([
        axios.get(`https://securepass-api-6arh.onrender.com/userInfo/${userID}`),
        axios.get(`https://securepass-api-6arh.onrender.com/accessLog/${userID}`),
        axios.get(`https://securepass-api-6arh.onrender.com/permissionUser/${userID}`),
      ]);

      setUserInfo(userInfoRes.data);
      setAccessLog(accessLogRes.data);
      setPermissionUser(permissionsUserRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast.error("Erro ao carregar dados do usuário");
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useIdleTimeout(1000000, handleLogout);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home 
              usersHome={usersHome} 
              permission={permission} 
              accessTest={accessTest} 
              reloadUsersHome={fetchInitialData} 
            />
          </ProtectedRoute>
        } />
        <Route path="/access" element={
          <ProtectedRoute>
            <Access 
              users={users} 
              accessTest={accessTest} 
              doors={doors} 
              reloadAccess={fetchInitialData} 
            />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userID" element={
          <ProtectedRoute>
            <UserProfileWrapper
              permission={permission}
              accessLog={accessLog}
              userInfo={userInfo}
              permissionUser={permissionUser}
              fetchData={fetchData}
              reloadUsersHome={fetchInitialData}
              setUserInfo={setUserInfo}
            />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </>
  );
}

function UserProfileWrapper({ permission, accessLog, userInfo, permissionUser, fetchData, setUserInfo, reloadUsersHome }) {
  const { userID } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setUserInfo(null);
      setLoading(true);
      await fetchData(userID);
      setLoading(false);
    };
    fetchUserProfileData();
  }, [userID, fetchData, setUserInfo]);

  if (loading) return <div>Carregando...</div>;
  if (!userInfo) return <div>Usuário não encontrado.</div>;

  return (
    <Profile
      permission={permission}
      permissionUser={permissionUser}
      accessLog={accessLog}
      userInfo={userInfo}
      reloadUsersHome={reloadUsersHome}
    />
  );
}

export default App;