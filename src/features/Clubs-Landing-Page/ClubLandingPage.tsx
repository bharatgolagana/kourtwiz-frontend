import { useParams, useNavigate } from "react-router-dom";
import "./ClubLandingPage.css";
import pickleball1 from "../../assets/pickleball1.jpg";

const clubs = [
  { id: 1, name: "Elite Pickleball Club", description: "Premium coaching and top-tier facilities.", image: pickleball1, bgColor: "#ffcccb" },
  { id: 2, name: "City Pickleball Hub", description: "A great place for community play and tournaments.", image: "path/to/image2.jpg", bgColor: "#d1e7dd" },
  { id: 3, name: "Champion's Court", description: "Train like a pro with experienced instructors.", image: "path/to/image3.jpg", bgColor: "#cce5ff" }
];
const ClubLandingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const club = clubs.find((club) => club.id === parseInt(id || "0"));
  
    if (!club) {
      return <h2>Club Not Found</h2>;
    }
  
    console.log("Club Found:", club);
    console.log("Background Color:", club.bgColor);
  
    return (
        <>
        <div className="button-group">
            <p>{club.name}</p>
              <button className="btn" onClick={() => navigate("/home")}>Login</button>
              <button className="btn" onClick={() => navigate("")}>Become a Member</button>
              <button className="btn" onClick={() => navigate(`/clubs/${id}/authentication`, { state: { clubName: club.name } })}>Authenticate</button>
            </div>
      <div className="club-landing" style={{ backgroundColor: club.bgColor }}>
          <div className="club-container">
            <h1>Welcome to {club.name}</h1>
            <p>{club.description}</p>
            <img src={club.image} alt={club.name} className="club-image" />
        </div>
      </div>
      </>
    );
  };
  

export default ClubLandingPage;
