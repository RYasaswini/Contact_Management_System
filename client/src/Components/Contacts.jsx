import React, { useState, useEffect } from 'react'; // Import useState
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import CircleLoader from 'react-spinners/CircleLoader';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const customStyles = {
  headCells: {
    style: {
      fontSize: 15 + "px",
      fontWeight: 600,
    },
  },
  cells: {
    style: {
      fontSize: 13 + "px",
      fontWeight: 500,
    },
  },
};

const MySwal = withReactContent(Swal);

const Contacts = () => {
  const [contacts, setContacts] = useState([]); // Initialize contacts state
  const [loading, setLoading] = useState(false); // Define loading state

  const deleteRecord = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/contactmsyt/contact/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            if (res.data.success) {
              // Remove deleted contact from state
              setContacts(contacts.filter(contact => contact._id !== id));
              MySwal.fire({
                title: "Deleted!",
                text: "Your contact has been deleted.",
                icon: "success",
              });
            } else {
              MySwal.fire({
                title: "Error!",
                text: res.data.error || "Failed to delete contact.",
                icon: "error",
              });
            }
          })
          .catch((err) => {
            MySwal.fire({
              title: "Error!",
              text: "Error occurred while deleting the contact.",
              icon: "error",
            });
          });
      }
    });
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <Link to={`/dashboard/edit-contact/${row._id}`}>
            <FaPenToSquare className='table-icon1' />
          </Link>
          <FaRegTrashCan className='table-icon2' onClick={() => deleteRecord(row._id)} />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/contactmsyt/contacts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setLoading(false); // Stop loading
        if (res.data.success) {
          setContacts(res.data.contacts);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {
        loading ? (
          <div className='loader'>
            <CircleLoader 
              loading={loading}
              size={50}
              aria-label="loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div className='contact-list'>
            <DataTable 
              columns={columns} 
              data={contacts} 
              customStyles={customStyles} 
              pagination 
            />
            {contacts.length === 0 ? <h1>Add a Contact</h1> : <></>}
          </div>
        )
      }
    </>
  );
};

export default Contacts;
