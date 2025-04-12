import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./MemberRegistrationSignup.css";
import { useMutateSignUpMember } from "../../features/member-registration/api/useMutateSignupMember";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { useSendOTP } from "../../features/member-registration/api/useSendOTP";
import { useValidateOTP } from "../../features/member-registration/api/useValidateOTP";
import { TextField, Button, Grid, Typography, Paper, Divider, MenuItem, IconButton } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    file: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "File is required",
    })
    .optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    emailOTP: z.string().min(6, "Email OTP is required"),
    phoneOTP: z.string().optional(),
    skillLevel: z.string().min(1, "Skill level is required"),
    preferredTime: z.string().min(1, "Preferred time is required"),
    paymentDetails: z.object({
      cardNumber: z.string().min(16, "Card number must be 16 digits"),
      cvv: z
        .string()
        .min(3, "CVV must be at least 3 digits")
        .max(4, "CVV must be at most 4 digits"),
      expiryDate: z.string().min(5, "Expiry date is required"),
      cardHolderName: z.string().min(1, "Cardholder name is required"),
      cardTypeEnum: z.enum(["VISA", "MASTERCARD", "AMEX"]).default("VISA"),
    }),
  });

type FormValues = z.infer<typeof schema>;

const MemberRegistrationSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clubId, clubName, membershipId } = location.state || {};
  const { mutate } = useMutateSignUpMember({
    onSuccessCallback: () => {
      toast.success("Member created! Check your email for login credentials.");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    },
    onErrorCallback: () => {
      toast.error("Error while assigning role");
    },
  });

  const { emailOTP, phoneOTP } = useSendOTP();
  const validateOTP = useValidateOTP();

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const email = watch("email");
  const phoneNumber = watch("phoneNumber");
  const emailOtpValue = watch("emailOTP");
  const phoneOtpValue = watch("phoneOTP");

  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [isEmailOtpValid, setIsEmailOtpValid] = useState<boolean | null>(null);
  const [isPhoneOtpValid, setIsPhoneOtpValid] = useState<boolean | null>(null);
  const [emailTimer, setEmailTimer] = useState(120);
  const [phoneTimer, setPhoneTimer] = useState(120);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let emailInterval, phoneInterval;

    if (emailSent && emailTimer > 0) {
      emailInterval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    } else if (emailTimer === 0) {
      setEmailSent(false);
      setEmailTimer(120);
    }

    if (phoneSent && phoneTimer > 0) {
      phoneInterval = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    } else if (phoneTimer === 0) {
      setPhoneSent(false);
      setPhoneTimer(120);
    }

    return () => {
      clearInterval(emailInterval);
      clearInterval(phoneInterval);
    };
  }, [emailSent, emailTimer, phoneSent, phoneTimer]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file); // pass File object to the form
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String); // optional: just for preview
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        console.error("Camera error:", err);
        toast.error("Error accessing camera");
        setIsCameraOpen(false);
      });
  };
  
  const captureImage = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64String = canvas.toDataURL('image/png');
        setImageBase64(base64String);
        setValue("file", base64String);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsCameraOpen(false);
      }
    }
  };
  
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const sendEmailOTP = () => {
    if (!email) {
      toast.error("Enter a valid email first.");
      return;
    }
    emailOTP.mutate(email, {
      onSuccess: () => {
        setEmailSent(true);
        setEmailTimer(120);
        toast.success("OTP sent to email!");
      },
      onError: () => toast.error("Failed to send OTP."),
    });
  };

  const sendPhoneOTP = () => {
    if (!phoneNumber) {
      toast.error("Enter a valid phone number first.");
      return;
    }
    phoneOTP.mutate(phoneNumber, {
      onSuccess: () => {
        setPhoneSent(true);
        setPhoneTimer(120);
        toast.success("OTP sent to phone!");
      },
      onError: () => toast.error("Failed to send OTP."),
    });
  };

  useEffect(() => {
    if (emailOtpValue?.length === 6) {
      validateOTP.mutate(
        { recipient: email, otp: emailOtpValue },
        {
          onSuccess: (isValid) => {
            setIsEmailOtpValid(isValid);
              toast.success("OTP verified");
          },
          onError: () => {
            setIsEmailOtpValid(false);
            toast.error("Invalid OTP");
          },
        }
      );
    }
  }, [emailOtpValue]);

  useEffect(() => {
    if (phoneOtpValue?.length === 6) {
      validateOTP.mutate(
        { recipient: phoneNumber, otp: phoneOtpValue },
        {
          onSuccess: (isValid) => {
            setIsPhoneOtpValid(isValid);
              toast.success("OTP verified");
          },
          onError: () => {
            setIsPhoneOtpValid(false);
            toast.error("Invalid OTP");
          },
        }
      );
    }
  }, [phoneOtpValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
      currentActiveClubId: clubId,
      membershipTypeId: membershipId,
    };

    mutate(payload);
  };

  return (
    <Paper elevation={3} className="signup-container" sx={{ p: 4 }}>
      <img
        src="/src/assets/memberSignup.jpg"
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.5,
          zIndex: -1,
        }}
      />
      <div className="signup-form">
        <Typography variant="h4" className="company-name">
          {clubName || "Company Name"}
        </Typography>
        <Typography variant="h6" className="signup-heading">
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* PERSONAL INFO SECTION */}
            <Grid item xs={12}>
              <Typography variant="h6">Personal Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Image Upload Section */}
            <Grid container spacing={2}>
              {!isCameraOpen && (
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                  >
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileUpload}
                      required
                    />
                  </Button>
                </Grid>
              )}

              {/* Camera Button/Preview */}
              {!isCameraOpen ? (
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    
                    onClick={handleOpenCamera}
                    startIcon={<CameraAltIcon />}
                  >
                    Open Camera
                  </Button>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Camera Preview - Smile!
                  </Typography>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    required
                    style={{ 
                      width: '100%', 
                      maxWidth: '400px', 
                      margin: '10px 0',
                      border: '2px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={captureImage}
                      startIcon={<CameraAltIcon />}
                    >
                      Capture Photo
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={closeCamera}
                    >
                      Cancel
                    </Button>
                  </div>
                </Grid>
              )}

              {/* Image Preview */}
              {imageBase64 && !isCameraOpen && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Photo Preview
                  </Typography>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imageBase64}
                      alt="preview"
                      style={{ 
                        width: '200px', 
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <IconButton
                      aria-label="delete photo"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)'
                      }}
                      onClick={() => {
                        setImageBase64(null);
                        setValue("file", "");
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Grid>
              )}
            </Grid>

            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              {
                label: "Date of Birth",
                name: "dateOfBirth",
                type: "date",
                shrink: true,
              },
              { label: "Gender", name: "gender" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Country", name: "country" },
              { label: "Zip Code", name: "zipCode" },
              { label: "Skill Level", name: "skillLevel" },
              { label: "Preferred Time", name: "preferredTime" },
            ].map(({ label, name, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  type={type || "text"}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  fullWidth
                  InputLabelProps={
                    type === "date" ? { shrink: true } : undefined
                  }
                />
              </Grid>
            ))}

            {/* VERIFICATION SECTION */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Verification</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Button
                onClick={sendEmailOTP}
                disabled={emailSent}
                variant="outlined"
                sx={{ height: "100%" }}
              >
                {emailSent
                  ? `Resend in ${Math.floor(emailTimer / 60)}:${String(
                      emailTimer % 60
                    ).padStart(2, "0")}`
                  : "Send OTP"}
              </Button>
              <TextField
                label="Email OTP"
                {...register("emailOTP")}
                error={!!errors.emailOTP}
                helperText={errors.emailOTP?.message}
                fullWidth
              />
            </Grid>

            {/* Phone Number & OTP */}
            <Grid item xs={12} sm={6}>
              <PhoneInput
                international
                defaultCountry="US"
                countryCallingCodeEditable={false}
                error={!!errors.phoneNumber}
                value={watch("phoneNumber")}
                onChange={(value) =>
                    setValue("phoneNumber", value)}
                maxlength={15}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Button
                onClick={sendPhoneOTP}
                disabled={phoneSent}
                variant="outlined"
                sx={{ height: "100%" }}
              >
                {phoneSent
                  ? `Resend in ${Math.floor(phoneTimer / 60)}:${String(
                      phoneTimer % 60
                    ).padStart(2, "0")}`
                  : "Send OTP"}
              </Button>
              <TextField
                label="Phone OTP"
                {...register("phoneOTP")}
                error={!!errors.phoneOTP}
                helperText={errors.phoneOTP?.message}
                fullWidth
              />
            </Grid>

            {/* PAYMENT DETAILS SECTION */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Payment Details</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            {[
              {
                label: "Card Number",
                name: "paymentDetails.cardNumber",
                type: "text",
              },
              { label: "CVV", name: "paymentDetails.cvv", type: "password" },
              {
                label: "Expiry Date",
                name: "paymentDetails.expiryDate",
                type: "text",
              },
              {
                label: "Cardholder Name",
                name: "paymentDetails.cardHolderName",
                type: "text",
              },
            ].map(({ label, name, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  type={type}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  fullWidth
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Card Type"
                {...register("paymentDetails.cardTypeEnum")}
                error={!!errors.paymentDetails?.cardTypeEnum}
                helperText={errors.paymentDetails?.cardTypeEnum?.message}
                fullWidth
              >
                {["VISA", "MASTERCARD", "AMEX"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Paper>
  );
};

export default MemberRegistrationSignupPage;
