export const validation = {
    validateEmail(email) {
        if (!email) {
            return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        return null;
    },

    validatePassword(password) {
        if (!password) {
            return "Password is required";
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters";
        }
        return null;
    },

    validateName(name) {
        if (!name) {
            return "Name is required";
        }
        if (name.trim().length < 2) {
            return "Name must be at least 2 characters";
        }
        return null;
    },

    validatePostContent(content) {
        if (!content || !content.trim()) {
            return "Post content is required";
        }
        if (content.trim().length < 1) {
            return "Post must have at least 1 character";
        }
        if (content.length > 500) {
            return "Post must be less than 500 characters";
        }
        return null;
    },

    validateCommentContent(content) {
        if (!content || !content.trim()) {
            return "Comment is required";
        }
        if (content.trim().length < 1) {
            return "Comment must have at least 1 character";
        }
        return null;
    },
};
