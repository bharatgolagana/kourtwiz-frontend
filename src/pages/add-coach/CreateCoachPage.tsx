import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../../context/AuthContext';
import './CreateCoachPage.css';
import { useCreateCoach } from '../../features/Coach/api/useCreateCoach';

type FormValues = {
  name: string;
  email: string;
  pricePerHour: string;
  expertiseLevels: string;
};

function CreateCoachPage() {
  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      pricePerHour: '',
      expertiseLevels: '',
    },
  });

  const { mutate, isPending } = useCreateCoach();

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      clubId,
      expertiseLevels: [data.expertiseLevels],
    };

    mutate(payload, {
      onSuccess: () => {
        alert('Coach created successfully!');
        reset();
      },
      onError: (error: any) => alert(error?.message ?? 'Something went wrong.'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="coach-form">
      <label className="form-label">
        Name:
        <input type="text" {...register('name', { required: true })} className="form-input" />
      </label>

      <label className="form-label">
        Email:
        <input type="email" {...register('email', { required: true })} className="form-input" />
      </label>

      <label className="form-label">
        Price Per Hour:
        <input
          type="number"
          step="0.01"
          {...register('pricePerHour', { required: true })}
          className="form-input"
        />
      </label>

      <label className="form-label">
        Expertise Level:
        <select {...register('expertiseLevels', { required: true })} className="form-input">
          <option value="">Select an expertise level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>

      <button type="submit" className="submit-button" disabled={isPending || isSubmitting}>
        {isPending || isSubmitting ? 'Submitting...' : 'Create Coach'}
      </button>
    </form>
  );
}

export default CreateCoachPage;
