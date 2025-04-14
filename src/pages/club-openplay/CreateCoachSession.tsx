import { useState, useEffect, useContext } from "react";
import { useGetCourts } from "../../features/bookings/api/useGetCourts";
import { useCreateOpenPlay } from "../../features/open-play-sessions/api/useCreateOpenPlay";
import AuthContext from "../../context/AuthContext";
import "./CreateOpenPlay.css";
import { fetchCoaches } from "../../features/coach-booking-calendar/api/getCoaches"; // Assuming you have this

function CreateCoachSession({ onSuccess, onClose }) {
  const { user } = useContext(AuthContext) || {};
  const clubId = user?.userClubRole?.[0]?.clubId ?? "";

  const [formData, setFormData] = useState({
    courtName: "",
    courtId: "",
    coachName: "",
    coachId: "",
    startTime: "",
    durationMinutes: "",
    priceForPlay: "",
    skillLevel: "",
    maxPlayers: "",
  });
  const [coachesData, setCoachesData] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [errorCoaches, setErrorCoaches] = useState(null);

  const mutation = useCreateOpenPlay();
  const { data: courtsData = [] } = useGetCourts(clubId);
  useEffect(() => {
    const loadCoaches = async () => {
      try {
        const data = await fetchCoaches(clubId);
        setCoachesData(data);
      } catch (err) {
        console.error(err);
        setErrorCoaches(err.message || "Failed to load coaches.");
      } finally {
        setLoadingCoaches(false);
      }
    };

    if (clubId) {
      loadCoaches();
    }
  }, [clubId]);

  useEffect(() => {
    const court = courtsData?.find((c) => c.name === formData.courtName);
    const coach = coachesData.find((c) => c.name === formData.coachName);

    setFormData((prev) => ({
      ...prev,
      courtId: court?.id ?? "",
      coachId: coach?.id ?? "",
    }));
  }, [formData.courtName, formData.coachName, courtsData, coachesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      courtId,
      coachId,
      startTime,
      durationMinutes,
      skillLevel,
      maxPlayers,
      priceForPlay,
    } = formData;

    if (!courtId || !coachId || !startTime || !durationMinutes || !skillLevel || !maxPlayers || !priceForPlay) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      playTypeName: "COACH_SESSION",
      clubId,
      courtId,
      coachId,
      startTime,
      durationMinutes: Number(durationMinutes),
      priceForPlay: Number(priceForPlay),
      skillLevel: "3",
      maxPlayers: Number(maxPlayers),
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        alert("Coach session created successfully!");
        setFormData({
          courtName: "",
          courtId: "",
          coachName: "",
          coachId: "",
          startTime: "",
          durationMinutes: "",
          priceForPlay: "",
          skillLevel: "",
          maxPlayers: "",
        });
        onSuccess?.();
      },
      onError: (err) => alert(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="openplay-form">
      <label className="form-label">
        Court Name:
        <select
          name="courtName"
          value={formData.courtName}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select a court</option>
          {courtsData.map((court) => (
            <option key={court.id} value={court.name}>
              {court.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Coach Name:
        <select
          name="coachName"
          value={formData.coachName}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select a coach</option>
          {coachesData.map((coach) => (
            <option key={coach.id} value={coach.name}>
              {coach.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Start Time:
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Duration (Minutes):
        <input
          type="number"
          name="durationMinutes"
          value={formData.durationMinutes}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Price:
        <input
          type="number"
          name="priceForPlay"
          value={formData.priceForPlay}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Skill Level:
        <select
          name="skillLevel"
          value={formData.skillLevel}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select skill level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>

      <label className="form-label">
        Max Players:
        <input
          type="number"
          name="maxPlayers"
          value={formData.maxPlayers}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          Create Coach Session
        </button>
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateCoachSession;
