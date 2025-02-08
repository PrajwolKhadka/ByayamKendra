'use client';

import { useEffect, useState } from "react"
import axios from "axios"
import "../css/UserManagement.css"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({ username: "", email: "", password: "", gender: "", role: "user" })
  const [editingUserId, setEditingUserId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      alert("An error occurred while fetching users.")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUserId) {
        await axios.put(`http://localhost:3000/api/auth/users/${editingUserId}`, formData)
      } else {
        await axios.post("http://localhost:3000/api/auth/signup", formData)
      }
      setFormData({ username: "", email: "", password: "", gender: "", role: "user" })
      setEditingUserId(null)
      fetchUsers()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form.")
    }
  }

  const handleEdit = (user) => {
    setFormData({ username: user.username, email: user.email, password: "", gender: user.gender, role: user.role })
    setEditingUserId(user.id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("An error occurred while deleting the user.")
    }
  }

  return (
    <div className="user-management">
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="form-row">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-row">
          <select name="role" className="userselect" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-row">
          <button type="submit">{editingUserId ? "Update User" : "Create User"}</button>
        </div>
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
