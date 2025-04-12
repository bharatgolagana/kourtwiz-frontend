import { useState, useEffect, useContext } from "react";
import { useCreateOpenPlay } from "../../features/open-play-sessions/api/useCreateOpenPlay";
import "./CreateOpenPlay.css";
import { useGetCourts } from "../../features/bookings/api/useGetCourts";
import AuthContext from "../../context/AuthContext";

const PLAY_TYPES = [
  { label: "Open Play", value: "OPEN_PLAY" },
  { label: "Private Lesson", value: "PRIVATE_LESSON" },
  { label: "Group Lesson", value: "GROUP_LESSON" },
  { label: "Clinic", value: "CLINIC" },
  { label: "Tournament", value: "TOURNAMENT" },
  { label: "League", value: "LEAGUE" },
];

const EVENT_REPEAT_TYPES = ["NONE", "DAILY", "WEEKLY", "MONTHLY"];

function CreateOpenPlay({ onSuccess, onClose }) {
  const { user } = useContext(AuthContext) || {};
  const clubId = user?.userClubRole?.[0]?.clubId ?? "";

  const [formData, setFormData] = useState({
    clubId: clubId,
    courtName: "",
    courtId: "",
    playTypeName: "OPEN_PLAY",
    startTime: "",
    durationMinutes: "",
    priceForPlay: "",
    skillLevel: "",
    maxPlayers: "",
    eventRepeatType: "NONE",
    repeatEndDate: "",
    repeatInterval: ""
  });

  const mutation = useCreateOpenPlay();
  const { data: courtsData = [] } = useGetCourts(clubId);

  useEffect(() => {
    if (formData.courtName && courtsData?.length) {
      const matchedCourt = courtsData.find(
        (court) => court.name.toLowerCase() === formData.courtName.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        courtId: matchedCourt ? matchedCourt.id : "",
        clubId: clubId,
      }));
    }
  }, [formData.courtName, courtsData, clubId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.courtId || !formData.startTime || !formData.durationMinutes || !formData.skillLevel || !formData.maxPlayers || !formData.priceForPlay) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      playTypeName: formData.playTypeName,
      clubId: formData.clubId,
      courtId: formData.courtId,
      startTime: formData.startTime,
      durationMinutes: Number(formData.durationMinutes),
      priceForPlay: Number(formData.priceForPlay),
      skillLevel: formData.skillLevel,
      maxPlayers: Number(formData.maxPlayers),
      eventRepeatType: formData.eventRepeatType,
      repeatEndDate: formData.repeatEndDate? `${formData.repeatEndDate}T00:00:00`: null,
      repeatInterval: formData.eventRepeatType !== "NONE" ? Number(formData.repeatInterval) : null
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        alert("Session created successfully!");
        setFormData({
          clubId: clubId,
          courtName: "",
          courtId: "",
          playTypeName: "OPEN_PLAY",
          startTime: "",
          durationMinutes: "",
          priceForPlay: "",
          skillLevel: "",
          maxPlayers: "",
          eventRepeatType: "NONE",
          repeatEndDate: "",
          repeatInterval: "",
        });
        onSuccess?.();
      },
      onError: (error) => alert(error.message),
    });
  };

  return (
    <div className="openplay-form-container">
      <form onSubmit={handleSubmit} className="openplay-form">
          <label className="form-label">
            Play Type:
            <select
              name="playTypeName"
              value={formData.playTypeName}
              onChange={handleChange}
              className="form-input"
              required
            >
              {PLAY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

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
              {courtsData?.map((court) => (
                <option key={court.id} value={court.name}>
                  {court.name}
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
          Price for Play ($):
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

        <label className="form-label">
          Repeat Type:
          <select
            name="eventRepeatType"
            value={formData.eventRepeatType}
            onChange={handleChange}
            className="form-input"
            required
          >
            {EVENT_REPEAT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {formData.eventRepeatType !== "NONE" && (
          <>
            <label className="form-label">
              Repeat Interval:
              <input
                type="number"
                name="repeatInterval"
                value={formData.repeatInterval}
                onChange={handleChange}
                className="form-input"
                required
              />
            </label>

            <label className="form-label">
              Repeat End Date:
              <input
                type="date"
                name="repeatEndDate"
                value={formData.repeatEndDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </label>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Session
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOpenPlay;
