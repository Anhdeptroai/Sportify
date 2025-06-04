import { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Chào bạn! Tôi có thể giúp gì?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response || "Lỗi phản hồi!" };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Lỗi gọi API" }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="bg-gray-900 w-full h-screen m-auto p-5 flex flex-col">
      <h2 className="text-white">🧠 Chatbot</h2>
      <div className="border-gray-50 border-2 p-2.5 h-full overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }} className="text-white">
            <p><strong>{msg.sender}:</strong> {msg.text}</p>
          </div>
        ))}
        {loading && <p className="text-white"><em>Đang suy nghĩ...</em></p>}
      </div>
      <div className="flex flew-row mt-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="w-full p-2 mr-2 border-2 border-white rounded text-white text-md"
        />
        <button onClick={sendMessage} className="w-48 p-2 text-white bg-gray-600 rounded">Gửi</button>
      </div>
    </div>
  );
};

export default Chatbot;
