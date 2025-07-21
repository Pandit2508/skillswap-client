import React, { useState } from "react";
import  Button  from "../components/ui/Button";

const CreateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills_offered: "",
    skills_wanted: "",
    availability: [],
    location: "",
    experience: "",
  });

  const updateAvailability = (index, field, value) => {
    const updated = [...form.availability];
    updated[index][field] = value;
    setForm({ ...form, availability: updated });
  };

  const addAvailability = () => {
    setForm({
      ...form,
      availability: [...form.availability, { day: "", start_time: "", end_time: "" }],
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Profile created successfully!");
        setForm({
          name: "",
          bio: "",
          skills_offered: "",
          skills_wanted: "",
          availability: [],
          location: "",
          experience: "",
        });
      } else {
        alert("Error creating profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl space-y-6">
      <h2 className="text-3xl font-bold text-center">Create Your Profile</h2>

      <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="w-full p-3 rounded-md text-black" />
      <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} className="w-full p-3 rounded-md text-black" rows="3" />

      <input name="skills_offered" placeholder="Skills You Offer (comma separated)" value={form.skills_offered} onChange={handleChange} className="w-full p-3 rounded-md text-black" />
      <input name="skills_wanted" placeholder="Skills You Want To Learn (comma separated)" value={form.skills_wanted} onChange={handleChange} className="w-full p-3 rounded-md text-black" />

      <div>
        <h3 className="text-xl font-semibold mb-2">Availability</h3>
        {form.availability.map((slot, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
            <select
              value={slot.day}
              onChange={(e) => updateAvailability(idx, "day", e.target.value)}
              className="p-2 rounded-md text-black"
            >
              <option value="">Day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={slot.start_time}
              onChange={(e) => updateAvailability(idx, "start_time", e.target.value)}
              className="p-2 rounded-md text-black"
            />
            <input
              type="time"
              value={slot.end_time}
              onChange={(e) => updateAvailability(idx, "end_time", e.target.value)}
              className="p-2 rounded-md text-black"
            />
          </div>
        ))}
        <Button type="button" onClick={addAvailability} className="mt-2 bg-blue-600 hover:bg-blue-700">
          + Add Availability
        </Button>
      </div>

      <input name="location" placeholder="Location (e.g. Delhi, Remote)" value={form.location} onChange={handleChange} className="w-full p-3 rounded-md text-black" />
      <input name="experience" placeholder="Experience Level (e.g. Beginner, Intermediate, Expert)" value={form.experience} onChange={handleChange} className="w-full p-3 rounded-md text-black" />

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Submit Profile</Button>
    </form>
  );
};

export default CreateProfile;
