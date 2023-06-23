import validator from "validator";

//req body
export const isReqBody = (data) => {
    if (Object.keys(data).length > 0) {
        return true
    }
    return false;
}

//title
export const isTitle = (data) => {
    if (data === 'Mr' || data === 'Mrs' || data === 'Miss') {
        return true;
    }
    return false;
}

//phone
export const isPhone = (data) => {
    const phoneRegex = /^(\+?91|0)?[6789]\d{9}$/;
    return phoneRegex.test(data);
}

//email
export const isEmail = (data) => {
    return validator.isEmail(data);
}

//password
export const isPassword = (data) => {
    const passwordRegex = /^.{8,15}$/;
    return passwordRegex.test(data);
}

//pincode
export const isPinCode = (data) => {
    const pinRegex = /^\d+$/;
    return pinRegex.test(data);
}

//Published at
export const isYear = (data) => {
    const yearRegex = /^(?:(?:19|20)\d{2})-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-30|(?:0[13578]|1[02])-31)$/
    return yearRegex.test(data);
}

//Review Rating
export const isRating = (data) => {
    if (data >= 1 && data <= 5) {
        return true;
    }
    return false;
}