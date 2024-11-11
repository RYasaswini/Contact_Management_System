import React, { useState } from 'react';
import '../assets/css/form.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaAt, FaPhoneFlip, FaRegAddressCard, FaUserPlus } from 'react-icons/fa6';

const AddContact = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    axios
      .post('http://localhost:3000/contactmsyt/add-contact', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        setLoading(false); // Stop loading
        if (res.data.success) {
          toast.success("Contact Added Successfully", {
            position: "top-right",
            autoClose: 5000
          });
          navigate('/dashboard'); // Redirect to dashboard
        }
      })
      .catch(err => {
        setLoading(false); // Stop loading on error
        console.error(err);
        toast.error("Failed to add contact. Please try again.", {
          position: "top-right",
          autoClose: 5000
        });
      });
  };

  return (
    <div className='add-form-container'>
      <form className='add-form' onSubmit={handleSubmit}>
        <h2>Create Contact</h2>

        <div className='form-group'>
          <FaUserPlus />
          <input type="text" placeholder="Enter Name" className="form-control" name='name' onChange={handleInput} required />
        </div>

        <div className='form-group'>
          <FaAt />
          <input type="email" placeholder="Enter Email" className="form-control" name='email' autoComplete="off" onChange={handleInput} required />
        </div>

        <div className='form-group'>
          <FaPhoneFlip />
          <input type="text" placeholder="Enter Phone Number" className="form-control" name='phone' onChange={handleInput} required />
        </div>

        <div className='form-group'>
          <FaRegAddressCard />
          <input type="text" placeholder="Enter Address" className="form-control" name='address' onChange={handleInput} />
        </div>

        <button className='form-btn' disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddContact;
