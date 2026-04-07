import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
export const ContactUsValidationSchema = yup.object().shape({
  name: yup.string().label("Your Name*").required("Name is required"),
  email: yup
    .string()
    .label("Your Email*")
    .required("The email address is required")
    .email("Invalid email address")
    .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),

  message: yup.string().required("Message is required"),
});

export const UserSignUpSchema = yup.object().shape({
  email: yup
    .string()
    .label("Email")
    .required("The email address is required")
    .email("Invalid email address")
    .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),
  password: yup
    .string()
    .label("Password")
    .required("The password field is required."),
});

export const SignUpSchema = yup.object().shape({
  email: yup
    .string()
    .label("Email")
    .required("The email address is required")
    .email("Invalid email address")
    .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),

  username: yup
    .string()
    .label("Full Name")
    .required("The name field is required"),

  password: yup
    .string()
    .label("Password")
    .required("The password field is required.")
    .min(8, "Password must be at least 8 characters long"),
  // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .matches(/\d/, "Password must contain at least one number")
  // .matches(
  //   /[!@#$%^&*(),.?":{}|<>]/,
  //   "Password must contain at least one special character"
  // )
  confirmPassword: yup
    .string()
    .label("Confirm Password")
    .oneOf([yup.ref("password")], "Password do not match"),

  terms: yup
    .boolean()
    .label("Terms and Conditions")
    .oneOf([true], "You must accept the terms and conditions"),

  // business: yup.string().required("The business name field is required."),
  // zipCode: yup
  //   .string()
  //   .matches(/^[0-9]{5}$/, "Invalid zip code")
  //   .required("Zip code is required"),
});

export const SignUpBusinessSchema = yup.object().shape({
  businessEmail: yup
    .string()
    .label("Email")
    .required("The email address is required")
    .email("Invalid email address")
    .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),

  businessUsername: yup
    .string()
    .label("Full Name")
    .required("The name field is required"),

  businessPassword: yup
    .string()
    .label("Password")
    .required("The password field is required.")
    .min(8, "Password must be at least 8 characters long"),
  // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .matches(/\d/, "Password must contain at least one number")
  // .matches(
  //   /[!@#$%^&*(),.?":{}|<>]/,
  //   "Password must contain at least one special character"
  // )
  businessConfirmPassword: yup
    .string()
    .label("Confirm Password")
    .oneOf([yup.ref("businessPassword")], "Password do not match"),

  businessTerms: yup
    .boolean()
    .label("businessTerms")
    .oneOf([true], "You must accept the terms and conditions"),

  businessBusiness: yup
    .string()
    .required("The business name field is required."),
  country: yup
    .string()

    .required("Country is required"),
  brands: yup
    .array()
    .min(1, "You must select at least one brand")
    .max(3, "You can select up to three brands only")
    .required("The brand is required."),
});

export const AddBusinessSchema = yup.object().shape({
  businessBusiness: yup
    .string()
    .required("The business name field is required."),
  country: yup
    .string()

    .required("Country is required"),

  brands: yup
    .array()
    .min(1, "You must select at least one brand")
    .max(3, "You can select up to three brands only")
    .required("The brand is required."),
});

export const UpdatePasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters long"),
  confirmPassword: yup
    .string()
    .required("Confirm new password is required")
    .oneOf([yup.ref("newPassword"), null], "Password must match"),
});

export const AuthenticationFormSingleValidation = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email"), null], "Email must match")
    .required("Please confirm your email"),

  selectCategory: yup.mixed().required("Please select a category"), // No type enforcement, just required
  selectBrand: yup.mixed().required("Please select a brand"),
  model: yup.string().required("Model is required"), // No type enforcement, just required

  termsAndCondition: yup
    .boolean()
    .label("Terms and Conditions")
    .oneOf([true], "You must Accept terms and conditions"),
  // images: yup
  //   .array()
  //   .of(
  //     yup
  //       .mixed()
  //       .required("Image is required") // Ensure the image is not null or undefined
  //       .test("fileType", "Unsupported file type", (value) => {
  //         return value && value.type && value.type.startsWith("image/");
  //       })
  //   )
  //   .min(3, "At least 3 images are required")
  //   .required("Images array is required"), // Ensure the images array is not empty or undefined

  // images: yup.mixed()
  //   .test("fileType", "Unsupported file type", (value) => {
  //     return value && value.type.startsWith("image/");
  //   })).min(3, "At least 3 images are required"),
  reCaptchaToken: yup
    .string()
    .required("Please complete the reCAPTCHA to proceed"),
});
export const AuthenticationFormBulkValidation = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email"), null], "Email must match")
    .required("Please confirm your email"),

  selectCategory: yup.mixed().required("Please select a category"), // No type enforcement, just required
  selectBrand: yup.mixed().required("Please select a brand"),
  model: yup.string().required("Model is required"), // No type enforcement, just required

  termsAndCondition: yup
    .boolean()
    .label("Terms and Conditions")
    .oneOf([true], "You must Accept terms and conditions"),
  // images: yup
  //   .array()
  //   .of(
  //     yup
  //       .mixed()
  //       .required("Image is required") // Ensure the image is not null or undefined
  //       .test("fileType", "Unsupported file type", (value) => {
  //         return value && value.type && value.type.startsWith("image/");
  //       })
  //   )
  //   .min(3, "At least 3 images are required")
  //   .required("Images array is required"), // Ensure the images array is not empty or undefined

  // images: yup.mixed()
  //   .test("fileType", "Unsupported file type", (value) => {
  //     return value && value.type.startsWith("image/");
  //   })).min(3, "At least 3 images are required"),
});

export const editUserProfileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("The email address is required"),
  about_us: yup.string().max(200, "Characters must not be greater than 200"),
  // country: yup.string().required("Country name is required"),
  // phone: yup
  //   .string()
  //   // .required("Phone is required")
  //   .matches(/^\d+$/, "Phone must only contain numbers"),
});

export const editBusinessProfileSchema = yup.object().shape({
  name: yup.string().required("Business name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("The email address is required"),
  about: yup.string().max(200, "Characters must not be greater than 200"),
  // address: yup.string().required("Company address is required"),
  website: yup.string().url("Must be a valid URL"),
  //   // .url("Must be valid url")
  //   .required("Company website is required"),
  // country: yup.string().required("Country name is required"),
  phoneNumber: yup
    .string()
    // .required("Phone is required")
    .matches(/^\d+$/, "Phone must only contain numbers"),

  marketPlace: yup.string().url("Must be a valid URL"),
  linkedin: yup.string().url("Must be a valid URL"),
  instagram: yup.string().url("Must be a valid URL"),
  facebook: yup.string().url("Must be a valid URL"),

  brands: yup
    .array()
    .min(1, "You must select at least one brand")
    .max(3, "You can select up to three brands only")
    .required("The brand is required."),
});

export const AuthenticityCardsValidationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .required("The email address is required")
    .email("Invalid email address")
    .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),
  phone: yup
    .string()
    // .required("Phone is required")
    .matches(/^\d+$/, "Phone must only contain numbers"),

  street1: yup.string().required("Street 1 is required"),
  // street2: yup.string().required("Street 2 is required"),
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup.string().required("Postal Code is required"),
  coaCount: yup.string().required("COA Count is required"),
});
export const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .label("Password")
    .required("The password field is required.")
    .min(8, "Password must be at least 8 characters long"),

  password_confirmation: yup
    .string()
    .label("Confirm Password")
    .oneOf([yup.ref("password")], "Password do not match"),
});
export const ForgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("The email address is required")
    .email("Invalid email address")
    .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),
});

export const ValuationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("The email address is required"),
  certificateNumber: yup.string().required("COA is required"),
  selectBrand: yup.mixed().required("Please select a brand"),
});
