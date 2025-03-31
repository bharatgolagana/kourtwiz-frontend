import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetClubCourt } from '../../../shared/apis/courts/useGetClubCourts';
import { useMutateAddCourt } from '../../../shared/apis/courts/useMutateAddCourt';
import AuthContext from '../../../context/AuthContext';

const CourtsList = () => {
  const { user } = useContext(AuthContext)!;
  const currentClubId = user?.currentActiveClubId;
  const { data: clubList, isLoading, error } = useGetClubCourt(currentClubId);
  const [showModal, setShowModal] = useState(false);
  const [blockedDatesArray, setBlockedDatesArray] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { mutate } = useMutateAddCourt({
    onSuccessCallback: () => {
      alert('Court added successfully!');
      setShowModal(false);
      reset();
      setBlockedDatesArray([]);
    },
    onErrorCallback: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    console.log('booking court : ', data);
    const courtData = {
      name: data.name,
      slug: data.slug,
      location: data.location,
      type: data.type,
      capacity: parseInt(data.capacity, 10),
      surface: data.surface,
      pricePerHour: parseFloat(data.pricePerHour),
      openingTime: data.openingTime + ' AM',
      closingTime: data.closingTime + ' PM',
      blockedDates: blockedDatesArray,
      available: data.available === 'true',
      indoor: data.indoor === 'true',
    };

    mutate({ clubId: currentClubId, courtData });
  };

  const handleAddDate = (e) => {
    const newDate = e.target.value;

    if (
      newDate &&
      !blockedDatesArray.includes(newDate) &&
      blockedDatesArray.length < 2
    ) {
      setBlockedDatesArray((prev) => [...prev, newDate]);
    } else {
      alert('You can add a maximum of 2 blocked dates.');
    }
  };

  const removeDate = (index) => {
    const updatedDates = blockedDatesArray.filter((_, i) => i !== index);
    setBlockedDatesArray(updatedDates);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Courts Table */}
        <div style={styles.section}>
          <h3 style={styles.subHeading}>Courts List</h3>
          {clubList && clubList.length > 0 ? (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Surface</th>
                    <th style={styles.th}>Capacity</th>
                    <th style={styles.th}>Price/Hour</th>
                    <th style={styles.th}>Opening Hours</th>
                    <th style={styles.th}>Blocked Dates</th>
                    <th style={styles.th}>Availability</th>
                    <th style={styles.th}>Indoor</th>
                  </tr>
                </thead>
                <tbody>
                  {clubList.map((court, index) => (
                    <tr
                      key={court.id}
                      style={{
                        ...styles.tr,
                        backgroundColor:
                          index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      }}
                    >
                      <td style={styles.td}>{court.name}</td>
                      <td style={styles.td}>{court.location}</td>
                      <td style={styles.td}>{court.type}</td>
                      <td style={styles.td}>{court.surface}</td>
                      <td style={styles.td}>{court.capacity}</td>
                      <td style={styles.td}>${court.pricePerHour}</td>
                      <td style={styles.td}>
                        {court.openingTime} - {court.closingTime}
                      </td>
                      <td style={styles.td}>
                        {court.blockedDates.length > 0
                          ? court.blockedDates.join(', ')
                          : 'None'}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color: court.available ? '#27ae60' : '#e74c3c',
                        }}
                      >
                        {court.available ? 'Available' : 'Booked'}
                      </td>
                      <td style={styles.td}>{court.indoor ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.noData}>No courts found.</p>
          )}
        </div>

        {/* Add New Court Button */}
        <div style={styles.section}>
          <button onClick={() => setShowModal(true)} style={styles.addButton}>
            Add New Court
          </button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Add New Court</h3>
              <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                <input
                  {...register('name', { required: true })}
                  placeholder='Name'
                />
                <input
                  {...register('slug', { required: true })}
                  placeholder='Slug'
                />
                <input
                  {...register('location', { required: true })}
                  placeholder='Location'
                />
                <select {...register('type', { required: true })}>
                  <option value=''>Select Type</option>
                  <option value='Singles'>Singles</option>
                  <option value='Doubles'>Doubles</option>
                  <option value='Singles & Doubles'>Singles & Doubles</option>
                </select>
                <input
                  {...register('capacity', { required: true })}
                  placeholder='Capacity'
                  type='number'
                  min={0}
                />
                <input
                  {...register('surface', { required: true })}
                  placeholder='Surface'
                />
                <input
                  {...register('pricePerHour', { required: true })}
                  placeholder='Price per hour'
                  type='number'
                  min={0}
                />
                <input
                  {...register('openingTime', { required: true })}
                  placeholder='Opening Time'
                  type='time'
                />
                <input
                  {...register('closingTime', { required: true })}
                  placeholder='Closing Time'
                  type='time'
                />
                <input type='date' onChange={handleAddDate} />
                <div>
                  {blockedDatesArray.map((date, index) => (
                    <span key={index} style={{ margin: '5px' }}>
                      {date}{' '}
                      <button onClick={() => removeDate(index)}>X</button>
                    </span>
                  ))}
                </div>
                <select {...register('available', { required: true })}>
                  <option value='true'>Available</option>
                  <option value='false'>Booked</option>
                </select>
                <select {...register('indoor', { required: true })}>
                  <option value='true'>Indoor</option>
                  <option value='false'>Outdoor</option>
                </select>
                <div style={styles.buttonContainer}>
                  <button type='submit' style={styles.submitButton}>
                    Submit
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { padding: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', backgroundColor: '#3498db', color: '#fff' },
  td: { padding: '12px' },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
  },
  submitButton: { backgroundColor: '#2ecc71', color: '#fff' },
  cancelButton: { backgroundColor: '#e74c3c', color: '#fff' },
};

export default CourtsList;
