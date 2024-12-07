import React, { useState } from "react";
import Groq from "groq-sdk"; // Import GROQ SDK
import "./psychologist.css";
import Sidebar from "../../components/Sidebar/Sidebar";

// Kreirajte instancu GROQ SDK sa vašim API ključem
const groq = new Groq({
  apiKey: "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", // Vaš API ključ
  dangerouslyAllowBrowser: true, // Omogućava korišćenje u pretraživaču (NEPOVOLJNO ZA SIGURNOST)
});

const Psychologist = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
      ]);
      setMessage("");
      setLoading(true);

      try {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          model: "llama3-8b-8192", // Zameni model ako je potrebno
        });

        const botMessage =
          response.choices[0]?.message?.content || "No response";
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error sending message to GROQ:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Oops! Something went wrong.", sender: "bot" },
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
            {loading && <p>GROQ is thinking...</p>}
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Unesite poruku..."
            />
            <button onClick={handleSendMessage}>Pošaljite</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Psychologist;
