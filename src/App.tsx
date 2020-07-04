// Third Party
import React, { FunctionComponent, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/auth-context';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Screens
import Home from './screens/home';
const Profile = lazy(() => import('./screens/profile'));

const AuthenticatedRoute = ({
  children,
  exact = false,
  path,
}: {
  children: React.ReactNode;
  path: string;
  exact?: boolean;
}) => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth();

  console.log(user);
  return (
    <Route
      exact={exact}
      path={path}
      render={() =>
        isAuthenticated ? { children } : loginWithRedirect()
      }></Route>
  );
};

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <AuthenticatedRoute path='/profile'>
          <Profile />
        </AuthenticatedRoute>
      </Switch>
    </Suspense>
  );
};

const App: FunctionComponent = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
