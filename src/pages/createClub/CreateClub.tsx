import { useForm } from "react-hook-form";
import axios from "axios";
import "./CreateClub.css";
import { toast } from "react-toastify";
import TestimonialCard from "../../features/createClub/TestimonialCard";

const CreateClub = () => {
    


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const API_URL = "http://44.216.113.234:8080/temp-clubs";


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      console.log("Response:", response.data);
      toast.success(
        "Request has been sent. Waiting for Zeta approval to allow you to log in.",
        {
          position: "top-right",
          autoClose: 4000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to register club. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <>
        <div className="create-club-container">
        <div className="create-club-content">
            <h2>Join our network of <br/>Pickleball Clubs</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div >
                <input
                type="text"
                {...register("name", { required: "Club Name is required" })}
                placeholder="Club Name"
                />
                {errors.name && <p className="error">{errors.name.message}</p>}
            </div>

            <div >
                <input
                type="text"
                {...register("address", { required: "Address is required" })}
                placeholder="Address"
                />
                {errors.address && <p className="error">{errors.address.message}</p>}
            </div>

            <div >
                <input
                type="text"
                {...register("url", { required: "URL is required" })}
                placeholder="URL"
                />
                {errors.url && <p className="error">{errors.url.message}</p>}
            </div>

            <div >
                <input
                type="text"
                {...register("ownerName", { required: "Full Name is required" })}
                placeholder="Full Name"
                />
                {errors.ownerName && <p className="error">{errors.ownerName.message}</p>}
            </div>

            <div>
                <input
                type="email"
                {...register("ownerEmail", {
                    required: "Email is required",
                    pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                    },
                })}
                placeholder="Email"
                />
                {errors.ownerEmail && <p className="error">{errors.ownerEmail.message}</p>}
            </div>


            <div>
                <input
                {...register("ownerPhoneNumber", {
                    required: "Phone Number is required",
                    pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                    },
                })}
                placeholder="Phone Number"
                />
                {errors.ownerPhoneNumber && (
                <p className="error">{errors.ownerPhoneNumber.message}</p>
                )}
            </div>

            <div>
                <input
                type="password"
                {...register("password", {
                    required: "Password is required",
                    minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                    },
                })}
                placeholder="Password"
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            <button type="submit">
                Register Club
            </button>
            </form>
        </div>
        </div>
        <div className="testimonials-container">
            <h3>What Our Users Say</h3>
            <div className="testimonials-grid">
                <TestimonialCard
                stars={5}
                review="Amazing platform! Our club has grown tremendously since joining."
                avatar="public\images\menavatar.png"
                name="John Smith"
                />
                <TestimonialCard
                stars={4}
                review="Great features and easy to use. Customer support is very responsive."
                avatar="public\images\femaleavatar.png"
                name="Emily Johnson"
                />
                <TestimonialCard
                stars={3}
                review="Good experience overall, but hoping for more customization options."
                avatar="public\images\menavatar.png"
                name="Michael Lee"
                />
            </div>
        </div>
    </>
  );
};

export default CreateClub;
