import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

export default function CreateMemberPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    uid: "",
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
    emergencyContact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await api.post("/users/member", form);

    const userId = response.data.user.id;

    navigate(`/members/${userId}`);
  };

  return (
    <Layout title="Create Member">
      <form className="panel form-panel" onSubmit={submit}>
        <h2>Account Information</h2>

        <div className="form-grid">
          <div>
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} />
          </div>

          <div>
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>RFID UID Optional</label>
            <input name="uid" value={form.uid} onChange={handleChange} />
          </div>
        </div>

        <h2>Personal Detail</h2>

        <div className="form-grid">
          <div>
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} />
          </div>

          <div>
            <label>Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          </div>

          <div>
            <label>Birth Date</label>
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Emergency Contact</label>
            <input
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
            />
          </div>

          <div className="full">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Create Member</button>
        </div>
      </form>
    </Layout>
  );
}