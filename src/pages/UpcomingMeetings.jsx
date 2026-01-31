import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import axios from "axios";

const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchMeetings();
    const timer = setInterval(fetchMeetings, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get("/api/bookings/my-meetings", {
        withCredentials: true,
      });
      setMeetings(res.data);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
  };

  const getCountdown = (sessionTime) => {
    const now = new Date();
    const meetingTime = new Date(sessionTime);
    const diff = meetingTime - now;

    if (diff <= 0) return "Meeting started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upcoming Meetings</h1>

        {meetings.length === 0 ? (
          <p className="text-gray-400">No upcoming meetings</p>
        ) : (
          <div className="space-y-6">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="bg-[#1e293b] p-6 rounded-2xl shadow-lg space-y-3"
              >
                <h2 className="text-xl font-semibold">
                  Meeting With: {m.person.name}
                </h2>

                <p>
                  <span className="font-semibold">Bio:</span>{" "}
                  {m.person.bio || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {m.person.location || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold">Experience:</span>{" "}
                  {m.person.experience || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold">Skills Offered:</span>{" "}
                  {m.person.skills.length
                    ? m.person.skills.join(", ")
                    : "Not specified"}
                </p>

                <p>
                  <span className="font-semibold">Skills Wanted:</span>{" "}
                  {m.person.skills_wanted.length
                    ? m.person.skills_wanted.join(", ")
                    : "Not specified"}
                </p>

                <div>
                  <span className="font-semibold">Availability:</span>
                  {m.person.availability.length ? (
                    <ul className="list-disc ml-5">
                      {m.person.availability.map((a, i) => (
                        <li key={i}>
                          {a.day} — {a.start_time} to {a.end_time}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    " Not specified"
                  )}
                </div>

                <p>
                  <span className="font-semibold">Meeting Time:</span>{" "}
                  {new Date(m.session_time).toLocaleString()}
                </p>

                <p className="text-gray-400">
                  Countdown: {getCountdown(m.session_time)}
                </p>

                <Button
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.open(m.meeting_link, "_blank")}
                >
                  Join Meeting
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
