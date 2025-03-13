import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import "./createUser.css";
import CustomTextField from "../../../../shared/customTextField/TextField";
import { useCreateUser, useRoles } from "../../api/userServiceApi";
import AutocompleteSelect from "../../../../shared/autoCompleteSelectComponent/AutoComplete";
import CustomButton from "../../../../shared/customButton/Button";
import { z } from "zod";
import { toast } from "react-toastify";
import { useUserInfo } from "../../../../context/UserInfoContext";

type Option = {
  id: string;
  value: string;
};

const userSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(
      /^(?!.*\s)[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, underscores (_), and dots (.) and cannot contain spaces"
    ),
  firstName: z.string().min(3, "first name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long."),
  email: z.string().email("Valid email is required."),
  primaryNumber: z
    .string()
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be 10 digits"),
  secondaryNumber: z.string().optional(),
  employeeNo: z.string().optional(),
  identificationNo: z.string().optional(),
  role: z.string().min(1, "Role selection is required."),
});

interface CreateUserProps {
  onClose: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onClose }) => {
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
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { userInfo } = useUserInfo();
  const userRole = userInfo.role;

  const { mutate: createUser } = useCreateUser({
    onError: (error: any) => {
      setIsSubmitting(false);
      if (error.response?.status === 409) {
        toast.error("Email already exists.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
    onSuccess: () => {
      setImageSrc(user.profile.profileImages[0]);
      toast.success("User created successfully!");
      setIsSubmitting(false);
      onClose();
    },
  });

  const validateForm = () => {
    try {
      userSchema.parse({
        userName,
        firstName,
        lastName,
        email,
        primaryNumber,
        secondaryNumber,
        employeeNo,
        identificationNo,
        role: selectedRole,
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("primaryNumber", primaryNumber);
      formData.append("secondaryNumber", secondaryNumber);
      formData.append("role", selectedRole);
      if (employeeNo) formData.append("employeeNo", employeeNo);
      if (identificationNo)
        formData.append("identificationNo", identificationNo);
      formData.append("gender", gender);
      formData.append("profileImage", fileInputRef.current?.files[0] || "");

      createUser(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleRoleChange = (_e: React.SyntheticEvent, value: Option | null) => {
    setSelectedRole(value?.value || "");
    setTouchedFields((prev) => ({ ...prev, selectedRole: true }));
    validateForm();
  };

  const handleCancel = () => {
    setImageSrc(null);
    setUserName("");
    setFirstName("");
    setLastName("");
    setGender("female");
    setEmail("");
    setPrimaryNumber("");
    setSecondaryNumber("");
    setSelectedRole("");
    setErrors({});
    setTouchedFields({});
    onClose();
  };

  const { data: rolesData } = useRoles();

  const formattedRoles: Option[] = Array.isArray(rolesData)
    ? rolesData?.map((role: string, index: number) => ({
        id: index.toString(),
        value: role?.name,
      }))
    : [];

  const selectedRoleOption =
    formattedRoles.find((option) => option.value === selectedRole) || null;

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [userName, firstName, lastName, email, primaryNumber, selectedRole]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="new-user-main-container">
        <div className="new-user-sub-heading">User info</div>
        <div className="image-container">
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer", textAlign: "center" }}
            className="user-image-container"
          >
            {imageSrc ? (
              <img className="user-image" src={imageSrc} alt="Uploaded" />
            ) : (
              <img
                className="user-image"
                src="src/assets/avatar.svg"
                alt="Default"
              />
            )}
            <div className="add-photo">{imageSrc ? "" : "Add Photo"}</div>
            <input
              ref={fileInputRef}
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImageSrc(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="remove-container">
            {imageSrc && (
              <div
                onClick={() => setImageSrc(null)}
                style={{ cursor: "pointer", marginTop: "10px" }}
              >
                Remove Photo
              </div>
            )}
          </div>
        </div>
        <div className="user-info-fields-container">
          <CustomTextField
            type="text"
            label="User Name"
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onBlur={handleBlur}
            required
            error={touchedFields.userName && !!errors.userName}
            helperText={touchedFields.userName ? errors.userName : ""}
          />
          <CustomTextField
            type="text"
            label="First Name"
            name="firstName"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={handleBlur}
            error={touchedFields.firstName && !!errors.firstName}
            helperText={touchedFields.firstName ? errors.firstName : ""}
          />
          <CustomTextField
            type="text"
            label="Last Name"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={handleBlur}
            error={touchedFields.lastName && !!errors.lastName}
            helperText={touchedFields.lastName ? errors.lastName : ""}
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
            required
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            error={touchedFields.email && !!errors.email}
            helperText={touchedFields.email ? errors.email : ""}
          />
          <CustomTextField
            type="text"
            label="Primary Number"
            name="primaryNumber"
            value={primaryNumber}
            required
            onChange={(e) => setPrimaryNumber(e.target.value)}
            onBlur={handleBlur}
            error={touchedFields.primaryNumber && !!errors.primaryNumber}
            helperText={touchedFields.primaryNumber ? errors.primaryNumber : ""}
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
            onChange={handleRoleChange}
            value={selectedRoleOption}
            label="Select a Role"
            error={touchedFields.selectedRole && !!errors.role}
            helperText={touchedFields.selectedRole ? errors.role : ""}
          />
        </div>
      </div>
      <div className="user-button-container">
        <CustomButton type="button" variant="contained" onClick={handleCancel}>
          Cancel
        </CustomButton>
        <CustomButton
          disabled={!isFormValid || isSubmitting}
          type="submit"
          variant="contained"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </CustomButton>
      </div>
    </form>
  );
};

export default CreateUser;
