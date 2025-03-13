import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React, { useRef, useState, useEffect } from "react";
import "./UpdateUser.css";
import CustomTextField from "../../../../shared/customTextField/TextField";
import { useUpdateUser, useGetUser, useRoles } from "../../api/userServiceApi";
import AutocompleteSelect from "../../../../shared/autoCompleteSelectComponent/AutoComplete";
import CustomButton from "../../../../shared/customButton/Button";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import profileImg from "../../../../../assets/avatar.svg";
import Loader from "../../../../shared/loader/Loader";
import { useUserInfo } from "../../../../context/UserInfoContext";
import { z } from "zod";

const userSchema = z.object({
  userName: z.string().min(1, { message: "User name is required." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Valid email is required." }),
  primaryNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Valid 10-digit number is required." }),
  role: z.string().min(1, { message: "Role selection is required." }),
  employeeNo: z.string().optional(),
  identificationNo: z.string().optional(),
});

interface Option {
  id: string;
  value: string;
}

const EditUser = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gender, setGender] = useState<string>("female");
  const [email, setEmail] = useState<string>("");
  const [primaryNumber, setPrimaryNumber] = useState<string>("");
  const [secondaryNumber, setSecondaryNumber] = useState<string>("");
  const [employeeNo, setEmployeeNo] = useState<string>("");
  const [identificationNo, setIdentificationNo] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [_orgId, setOrgId] = useState<string>("");
  const { userInfo } = useUserInfo();
  const userRole = userInfo.role;

  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id || "";
  const { data: user, isLoading } = useGetUser(userId);

  const { mutate: updateUser } = useUpdateUser();

  const { data: rolesData } = useRoles();

  const formattedRoles: Option[] = Array.isArray(rolesData?.roles)
    ? rolesData.roles.map((role: string, index: number) => ({
        id: index.toString(),
        value: role,
      }))
    : [];

  const selectedRoleOption =
    formattedRoles.find((option) => option.value === selectedRole) || null;
  const handleValidation = () => {
    try {
      const parsedData = userSchema.parse({
        userName,
        firstName,
        lastName,
        email,
        primaryNumber,
        role: selectedRole,
        employeeNo,
        identificationNo,
      });
      setErrors({});
      return parsedData;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const zodErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as { [key: string]: string });
        setErrors(zodErrors);
      }
      return null;
    }
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    const validatedData = handleValidation();

    if (!validatedData) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    const newData = {
      _id: userId,
      userName,
      firstName,
      lastName,
      gender,
      email,
      primaryNumber,
      secondaryNumber,
      role: selectedRole,
      ...(employeeNo && { employeeNo }),
      ...(identificationNo && { identificationNo }),
    };

    updateUser({ data: newData, file: fileInputRef.current?.files?.[0] });
    toast.success("User updated successfully");
    navigate("/list-users");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };
  const handleClose = () => {
    navigate("/list-users");
  };
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePhoto = () => {
    setImageSrc(null);
  };

  useEffect(() => {
    if (user) {
      setUserName(user.userName || "");
      setOrgId(user.organizationId || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setGender(user.gender || "female");
      setEmail(user.email || "");
      setPrimaryNumber(user.primaryNumber || "");
      setSecondaryNumber(user.secondaryNumber || "");
      setSelectedRole(user.role || "");
      setImageSrc(
        user.profile.profileImages.length > 0
          ? user.profile.profileImages[0]
          : null
      );
    }
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleUpdate}>
      <div className="update-user-main-container">
        <div className="edit-user-heading-container">
          <div className="edit-user-heading">Update User</div>
          <div>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="edit-user-sub-heading">User info</div>
        <div className="image-container">
          <div
            onClick={handleImageClick}
            style={{ cursor: "pointer", textAlign: "center" }}
            className="user-image-container"
          >
            {imageSrc ? (
              <img className="user-image" src={imageSrc} alt="Uploaded" />
            ) : (
              <img className="user-image" src={profileImg} alt="Default" />
            )}
            <div className="add-photo">{imageSrc ? "" : "Add Photo"}</div>
            <input
              ref={fileInputRef}
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="update-remove-container">
            {imageSrc && (
              <div
                onClick={handleRemovePhoto}
                style={{ cursor: "pointer", marginTop: "10px" }}
              >
                Remove Photo
              </div>
            )}
          </div>
        </div>
        <div className="update-user-info-fields-container">
          <CustomTextField
            type="text"
            label="User Name"
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            error={!!errors.userName}
            helperText={errors.userName}
            required
          />
          <CustomTextField
            type="text"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            required
            helperText={errors.firstName}
          />
          <CustomTextField
            type="text"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            required
            helperText={errors.lastName}
          />
          <FormControl>
            <FormLabel>
              {" "}
              Gender <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <RadioGroup
              row
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          <CustomTextField
            type="text"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <CustomTextField
            type="text"
            label="Primary Number"
            name="primaryNumber"
            value={primaryNumber}
            onChange={(e) => setPrimaryNumber(e.target.value)}
            error={!!errors.primaryNumber}
            helperText={errors.primaryNumber}
            required
          />
          <CustomTextField
            type="text"
            label="Secondary Number"
            value={secondaryNumber}
            onChange={(e) => setSecondaryNumber(e.target.value)}
          />
          <CustomTextField
            type="text"
            label="Employee No"
            name="employeeNo"
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value)}
          />
          <CustomTextField
            type="text"
            label="Identification No"
            name="identificationNo"
            value={identificationNo}
            onChange={(e) => setIdentificationNo(e.target.value)}
          />
        </div>
        <Divider />
        <div className="role-container">
          <div className="role-heading">
            {" "}
            Role <span style={{ color: "red" }}>*</span>
          </div>
          <AutocompleteSelect
            options={
              userRole === "Org Admin"
                ? formattedRoles.filter(
                    (role) =>
                      role.value !== "Admin" && role.value !== "Org Admin"
                  )
                : formattedRoles
            }
            getOptionLabel={(option) => option.value}
            onChange={(_e, value) => setSelectedRole(value?.value || "")}
            value={selectedRoleOption}
            label="Select a Role"
            error={!!errors.role}
            helperText={errors.role}
          />
        </div>
        <div className="update-user-button-container">
          <CustomButton type="submit" variant="contained">
            Update User
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default EditUser;
