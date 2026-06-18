import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "@/utils/auth";

const ProtectedRoute = () => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;