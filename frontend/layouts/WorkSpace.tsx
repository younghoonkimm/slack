import React, { useCallback, FC } from "react";
import { Redirect } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";

import fetcher from "@utils/fetcher";
//VFC
const WorkSpace: FC = ({ children }) => {
  const { data: userData, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 100000,
  });

  const onLogout = useCallback(() => {
    axios.post("http://localhost:3095/api/users/logout", null, { withCredentials: true }).then(() => {
      mutate("http://localhost:3095/api/users", false);
    });
  }, []);

  if (userData === undefined) {
    return <div></div>;
  }

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button type="button" onClick={onLogout}></button>
      {children}
    </div>
  );
};

export default WorkSpace;
