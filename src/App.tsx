import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SummaryAbsence from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import UserTable from './components/Tables/UserTable';
import SummaryUsers from './pages/TableUser';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route path="/calendar" element={<Calendar />} />
      {/* <Route path="/" element={<ECommerce />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forms/form-elements" element={<FormElements />} />
      <Route path="/forms/form-layout" element={<FormLayout />} /> */}
      <Route path="/summary-absence" element={<SummaryAbsence />} />
      <Route path="/list-users" element={<SummaryUsers />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/auth/signin" element={<SignIn />} />
      {/* <Route path="/chart" element={<Chart />} />
      <Route path="/ui/alerts" element={<Alerts />} />
      <Route path="/ui/buttons" element={<Buttons />} />
      
      <Route path="/auth/signup" element={<SignUp />} /> */}
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
  );
}

export default App;
