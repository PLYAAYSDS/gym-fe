import api from "./api";

export const getMembers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getMemberDetail = async (userId: number) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const assignRfid = async (userId: number, uid: string) => {
  const response = await api.put("/users/assign-rfid", {
    userId,
    uid,
  });

  return response.data;
};

export const extendMembership = async (
  userId: number,
  newExpiredDate: string,
) => {
  const response = await api.put("/users/extend-membership", {
    userId,
    newExpiredDate,
  });

  return response.data;
};

export const getMemberAttendanceHistory = async (userId: number) => {
  const response = await api.get(`/attendance/user/${userId}`);
  return response.data;
};