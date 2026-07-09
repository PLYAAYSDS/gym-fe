import api from "./api";

export const getMemberDashboard = async () => {
  const token = localStorage.getItem("memberToken");


  const response = await api.get("/users/member/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};