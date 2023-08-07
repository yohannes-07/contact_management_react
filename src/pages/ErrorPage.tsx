import { useRouteError } from 'react-router-dom';
import React from 'react';

interface RouteError {
  statusText?: string;
  message?: string;
}

const isError = (error: any): error is RouteError => {
  return (
    typeof error === 'object' &&
    (error.statusText || error.message) !== undefined
  );
};

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  return (
    <>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>
            {isError(error)
              ? error.statusText || error.message
              : 'Unknown Error'}
          </i>
        </p>
      </div>
    </>
  );
};

export default ErrorPage;
