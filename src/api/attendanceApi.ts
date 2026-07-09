import api from "./api";

export const checkInByUid = async (uid: string) => {
  const response = await api.post("/attendance/check-in", {
    uid,
  });

  return response.data;
};

export const qrCheckIn = async (qrToken: string) => {
  const response = await api.post("/attendance/qr-check-in", {
    qrToken,
  });

  return response.data;
};