import api from "./api";

export type MembershipDurationType = "TRIAL" | "MONTH";

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
  durationType: MembershipDurationType,
  duration: number,
) => {
  const response = await api.put("/users/extend-membership", {
    userId,
    durationType,
    duration,
  });

  return response.data;
};

export const getMemberAttendanceHistory = async (
  userId: number,
  month: number,
  year: number,
) => {
  const response = await api.get(
    `/attendance/user/${userId}?month=${month}&year=${year}`,
  );

  return response.data;
};