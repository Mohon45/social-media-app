import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const signupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .required("First name is required"),
    lastName: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const postSchema = Yup.object().shape({
    content: Yup.string()
        .min(1, "Post content cannot be empty")
        .max(500, "Post content must be less than 500 characters")
        .required("Post content is required"),
});

export const commentSchema = Yup.object().shape({
    content: Yup.string()
        .min(1, "Comment cannot be empty")
        .max(200, "Comment must be less than 200 characters")
        .required("Comment is required"),
});
