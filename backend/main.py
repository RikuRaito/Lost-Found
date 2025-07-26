from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

#To check the health of server
@app.route("/api/health",methods=["GET"])
def check_the_health():
    return jsonify({
        "status": "OK", "message": "Flask API is running"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)