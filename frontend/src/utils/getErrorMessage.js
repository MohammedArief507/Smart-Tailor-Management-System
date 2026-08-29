// Pulls a friendly error message out of an Axios error object
const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || "Something went wrong. Please try again."
  );
};

export default getErrorMessage;
