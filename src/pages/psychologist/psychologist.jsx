import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./psychologist.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Psychologist = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Add user's message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
      ]);
      setMessage("");
      setLoading(true);

      try {
        // Prepare the API request options
        const options = {
          method: "POST",
          url: "https://chatgpt-api8.p.rapidapi.com/",
          headers: {
            "x-rapidapi-key": "1313d4952emsha9f4593e6ef0a81p1ed8bajsn7b9c1e50264b",
            "x-rapidapi-host": "chatgpt-api8.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          data: [
            {
              content: message,
              role: "user",
            },
          ],
        };

        // Send message to the RapidAPI ChatGPT endpoint
        const response = await axios.request(options);

        // Extract bot response
        const botMessage = response.data?.text || "No response from the bot.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error sending message to RapidAPI:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Oops! Something went wrong. Please try again later.", sender: "bot" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="chatbox1-container">
      <div className="sidebar-div">
        <Sidebar />
      </div>
      <div className="chatbox-container">
        <div className="chatbox">
          <div className="chatbox-header">
            <h3>Dobrodošli! Kako vam mogu pomoći?</h3>
          </div>
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && <p>Thinking...</p>}
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder="Unesite poruku..."
            />
            <button onClick={handleSendMessage} disabled={loading}>
              {loading ? "Sending..." : "Pošaljite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Psychologist;
