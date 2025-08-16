import { useState, useEffect } from "react";

function SidebarComments() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing comments on mount
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch("/api/comments");
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  // Submit new comment
  async function submitComment() {
    if (!input.trim() || !username.trim()) {
      alert("Please enter both a username and a comment.");
      return;
    }

    const newComment = {
      username: username.trim(),
      content: input.trim(),
    };

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const savedComment = await res.json();
      setComments((prev) => [...prev, savedComment.comment[0]]);
      setInput("");
    } catch (err) {
      console.error(err);
      alert("Could not post comment. Try again.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        height: "500px",
        margin: "1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "#fafafa",
        overflow: "hidden",
        fontFamily: "serif",
      }}
    >
      <h3 style={{ margin: "0.5rem", color: "#222", fontWeight: 500, fontSize: "1.1rem" }}>
        Discussion
      </h3>

      {/* Comments Display */}
      <div
        style={{
          flex: 1,
          padding: "0.5rem 0.8rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          overflowY: "auto",
        }}
      >
        {loading && <div style={{ color: "#999", fontStyle: "italic" }}>Loading comments...</div>}
        {!loading && comments.length === 0 && (
          <div style={{ color: "#999", fontStyle: "italic" }}>No comments yet. Be the first to post!</div>
        )}
        {comments.map((c, i) => (
          <div
            key={i}
            style={{
              padding: "0.5rem 0.7rem",
              borderLeft: "3px solid #ddd",
              backgroundColor: "#fff",
              borderRadius: "3px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.2rem" }}>
              {new Date(c.time).toLocaleString()} - {c.username}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#222", lineHeight: "1.5" }}>{c.content}</div>
          </div>
        ))}
      </div>

      {/* Username & Comment Input */}
      <div style={{ borderTop: "1px solid #eee", padding: "0.5rem", backgroundColor: "#f9f9f9" }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          style={{
            width: "100%",
            marginBottom: "0.4rem",
            padding: "0.4rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontFamily: "serif",
            fontSize: "0.9rem",
          }}
        />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          style={{
            width: "100%",
            minHeight: "50px",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontFamily: "serif",
            fontSize: "0.95rem",
            lineHeight: "1.4",
            resize: "vertical",
          }}
        />
        <button
          onClick={submitComment}
          style={{
            marginTop: "0.4rem",
            padding: "0.4rem 0.9rem",
            fontWeight: 500,
            fontSize: "0.9rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            color: "#333",
            float: "right",
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default SidebarComments;