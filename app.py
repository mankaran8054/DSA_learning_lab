"""
DSA Learning Lab — Flask Application Entry Point
Serves the single-page application and any API routes.
"""

from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route("/")
def index():
    """Serve the main single-page application."""
    return render_template("index.html")


@app.route("/api/health")
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "app": "DSA Learning Lab"})


if __name__ == "__main__":
    print("\n" + "=" * 55)
    print("  DSA Learning Lab — Interactive CS Education Platform")
    print("=" * 55)
    print("  Server running at: http://127.0.0.1:5000")
    print("  Press Ctrl+C to stop the server.")
    print("=" * 55 + "\n")
    app.run(debug=True, host="127.0.0.1", port=5000)

