import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { getProfile } from "../api/auth";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills_offered: "",
    skills_wanted: "",
    availability: [],
    location: "",
    experience: "",
  });

  /* 🔹 LOAD EXISTING PROFILE (EDIT MODE) */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.data.user;

        if (user?.profile) {
          setIsEdit(true);
          setForm({
            name: user.name || "",
            bio: user.profile.bio || "",
            skills_offered: user.profile.skills?.join(", ") || "",
            skills_wanted: user.profile.skills_wanted?.join(", ") || "",
            availability: user.profile.availability || [],
            location: user.profile.location || "",
            experience: user.profile.experience || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateAvailability = (index, field, value) => {
    const updated = [...form.availability];
    updated[index][field] = value;
    setForm({ ...form, availability: updated });
  };

  const addAvailability = () => {
    setForm({
      ...form,
      availability: [
        ...form.availability,
        { day: "", start_time: "", end_time: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      skills_offered: form.skills_offered
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skills_wanted: form.skills_wanted
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEdit ? "Profile updated!" : "Profile created!");
        navigate("/dashboard", { replace: true });
      } else {
        const err = await res.json();
        alert(err.error || "Something went wrong");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-center">
        {isEdit ? "Update Your Profile" : "Create Your Profile"}
      </h2>

      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-3 rounded-md text-black"
      />

      <textarea
        name="bio"
        placeholder="Short Bio"
        value={form.bio}
        onChange={handleChange}
        className="w-full p-3 rounded-md text-black"
        rows="3"
      />

      <input
        name="skills_offered"
        placeholder="Skills You Offer (comma separated)"
        value={form.skills_offered}
        onChange={handleChange}
        className="w-full p-3 rounded-md text-black"
      />

      <input
        name="skills_wanted"
        placeholder="Skills You Want To Learn (comma separated)"
        value={form.skills_wanted}
        onChange={handleChange}
        className="w-full p-3 rounded-md text-black"
      />

      <div>
        <h3 className="text-xl font-semibold mb-2">Availability</h3>
        {form.availability.map((slot, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
            <input
              placeholder="Day"
              value={slot.day}
              onChange={(e) =>
                updateAvailability(idx, "day", e.target.value)
              }
              className="p-2 rounded-md text-black"
            />
            <input
              type="time"
              value={slot.start_time}
              onChange={(e) =>
                updateAvailability(idx, "start_time", e.target.value)
              }
              className="p-2 rounded-md text-black"
            />
            <input
              type="time"
              value={slot.end_time}
              onChange={(e) =>
                updateAvailability(idx, "end_time", e.target.value)
              }
              className="p-2 rounded-md text-black"
            />
          </div>
        ))}
        <Button type="button" onClick={addAvailability}>
          + Add Availability
        </Button>
      </div>

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full p-3 rounded-md text-black"
      />

      <input
        name="experience"
        placeholder="Experience Level"
        value={form.experience}
        onChange={handleChange}
        className="w-full p-3 rounded-md text-black"
      />

      <Button type="submit" className="w-full bg-green-600">
        {isEdit ? "Update Profile" : "Create Profile"}
      </Button>
    </form>
  );
};

export default CreateProfile;
