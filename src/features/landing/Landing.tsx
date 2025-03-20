import "./Landing.css";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/Header";
import pickleball1 from "../../assets/pickleball1.jpg";
import pickleball2 from "../../assets/pickleball2.jpg";
import Footer from "./components/header/Footer/Footer";

const clubs = [
  { id: 1, name: "Elite Pickleball Club", description: "Premium coaching and top-tier facilities.", bgColor: "#ffcccb" },
  { id: 2, name: "City Pickleball Hub", description: "A great place for community play and tournaments.", bgColor: "#d1e7dd" },
  { id: 3, name: "Champion's Court", description: "Train like a pro with experienced instructors.", bgColor: "#cce5ff" }
];

const Landing = () => {
  const navigate = useNavigate();

  const handleClubClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  return (
    <div className="landing">
      <Header />
      <section id="home">
        <div className="home-content">
          <h1>Level up your PickleBall game with Kourtwiz</h1>
          <p>Experience the best services with us. Start your journey today!</p>
          <div className="buttons">
            <button className="btn">Find a Place to Play</button>
            <button className="btn">Add a Player</button>
          </div>
          <img src={pickleball1} alt="Pickleball Game" className="home-image" />
        </div>
      </section>

      <section id="about">
        <div className="about-content">
          <img src={pickleball2} alt="Pickleball Game" className="about-image" />
          <div className="about-text-box">
            <h2>Level Up Your Game</h2>
            <p>Join Kourtwiz to enhance your Pickleball skills with expert coaching and top-tier facilities.</p>
            <button className="btn">Learn More</button>
          </div>
        </div>
      </section>

      <section id="clubs">
        <div className="clubs-content">
          <h2>Clubs</h2>
          <p>Find the best club for your Pickleball journey.</p>
          <div className="clubs-container">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="club-card"
                onClick={() => handleClubClick(club.id)}
                style={{ backgroundColor: club.bgColor }}
              >
                <h3>{club.name}</h3>
                <p>{club.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="pricing-content">
          <h2>Pricing</h2>
          <p>Choose the best plan for your Pickleball journey.</p>
          <div className="pricing-plans">
            <div className="plan">
              <h3>Basic Plan - Monthly</h3>
              <p>Perfect for casual players looking to improve their game.</p>
              <h4>$20 / month</h4>
              <button className="btn">Get Monthly Plan</button>
            </div>
            <div className="plan">
              <h3>Basic Plan - Yearly</h3>
              <p>Great value for dedicated players who train year-round.</p>
              <h4>$200 / year</h4>
              <button className="btn">Get Yearly Plan</button>
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="services-content">
          <h2>Our Services</h2>
          <p>Enhance your Pickleball experience with our top-notch services.</p>
          <div className="services-container">
            <div className="service-card">
              <h3>Court Booking</h3>
              <p>Reserve your court easily with our seamless online booking system.</p>
            </div>
            <div className="service-card">
              <h3>Scheduling</h3>
              <p>Plan your games and training sessions with our smart scheduling tool.</p>
            </div>
            <div className="service-card">
              <h3>Play Analysis</h3>
              <p>Improve your game with AI-driven insights and performance tracking.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
