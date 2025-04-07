import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import './CreateCoachPage.css';
import { useCreateCoach } from '../../features/Coach/api/useCreateCoach';

function CreateCoachPage() {
  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;

  const [formData, setFormData] = useState({
    clubId: '',
    name: '',
    email: '',
    pricePerHour: '',
    expertiseLevels: [] as string[],
  });

  const { mutate, isPending } = useCreateCoach();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'expertiseLevels') {
      setFormData((prev) => ({ ...prev, expertiseLevels: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      clubId,
    };

    const { name, email, pricePerHour, expertiseLevels } = payload;

    if (!name || !email || !pricePerHour || expertiseLevels.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    mutate(payload, {
      onSuccess: () => alert('Coach created successfully!'),
      onError: (error: any) => alert(error?.message ?? 'Something went wrong.'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="coach-form">
      <label className="form-label">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Price Per Hour:
        <input
          type="number"
          name="pricePerHour"
          value={formData.pricePerHour}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Expertise Level:
        <select
          name="expertiseLevels"
          value={formData.expertiseLevels[0] || ''}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select an expertise level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>

      <button type="submit" className="submit-button" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Create Coach'}
      </button>
    </form>
  );
}

export default CreateCoachPage;
