import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDepartment, getDepartmentById, updateDepartment } from '../services/departmentService';

const DepartmentForm = () => {
  const [department, setDepartment] = useState({ name: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const departmentData = await getDepartmentById(id);
        setDepartment(departmentData);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) {
      await updateDepartment(id, department);
    } else {
      await addDepartment(department);
    }
    navigate('/departments');
  };

  return (
    <div>
      <h2>{id ? 'Edit Department' : 'Add Department'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={department.name} onChange={handleChange} placeholder="Department Name" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default DepartmentForm;
