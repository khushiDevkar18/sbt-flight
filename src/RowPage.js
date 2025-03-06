import { useState } from "react";
import Chip from "@mui/material/Chip"; // Import MUI Chip component

const EmailInputWithChips = () => {
  const [emailInput, setEmailInput] = useState(""); // Track input field value
  const [emails, setEmails] = useState([]); // Store entered emails
  const [errors, setErrors] = useState({}); // Store validation errors

  const handleChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Prevent form submission

      const trimmedEmail = emailInput.trim();
      if (trimmedEmail && !emails.includes(trimmedEmail)) {
        if (/\S+@\S+\.\S+/.test(trimmedEmail)) { // Validate email format
          setEmails([...emails, trimmedEmail]);
          setErrors({}); // Clear errors
        } else {
          setErrors({ additionalEmail: "Invalid email format" });
        }
      }

      setEmailInput(""); // Clear input field
    }
  };

  const handleDelete = (emailToDelete) => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };

  return (
    <div className="pannel"style={{height:'150px'}}>

    
    {/* <div className="w-full">
      <label htmlFor="additionalEmail" className="text-sm">Additional Email</label>
      <input
        id="additionalEmail"
        name="additionalEmail"
        type="text"
        placeholder="Enter Email and press Enter"
        className="frmTextInput2"
        value={emailInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Capture Enter key
      />
      {errors.additionalEmail && <p className="text-red-500 text-xs">{errors.additionalEmail}</p>}

      <div className="flex flex-wrap gap-2 mt-2">
        {emails.map((email, index) => (
          <Chip
            key={index}
            label={email}
            variant="outlined"
            onDelete={() => handleDelete(email)}
          />
        ))}
      </div>
    </div> */}
    <h5>Hekllo</h5>
    </div>
  );
};

export default EmailInputWithChips;
