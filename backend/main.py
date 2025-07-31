from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import hashlib

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])


#deta_fileに書かれた.jsonファイルの中身を読みだす
def read_data(data_file):
    with open(data_file, 'r', encoding = 'utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

#data_fileにdataを追加する関数(pwdはmd5でハッシュ化して文字列として保存)
def write_data(data_file,userData,data):
    data['password'] = hashlib.md5(data.get('password').encode()).hexdigest()
    userData.append(data)
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(userData, f, indent=4, ensure_ascii=False)

#To check the health of server
@app.route("/api/health",methods=["GET"])
def check_the_health():
    return jsonify({
        "status": "OK", "message": "Flask API is running"
    })

#ユーザー登録
@app.route("/api/signup",methods=["POST"])
def signup_users():
    if request.is_json:
        data = request.json
        mail = data.get('email')

        userData = read_data("userData.json")
        #データベース上の全メールアドレスを参照し，入力と一致するものを探す
        for m in userData:
            if(m.get('email') == mail) :
                #見つかったらデータベースに追加しない
                return jsonify({"status" : "FOUND", "message" : "You have already signed up!"}), 201
        #見つからなかったらデータベースに追加
        write_data("userData.json",userData,data)
        return jsonify({"status" : "NEW", "message" : "Signed up correctly!"}), 201
    
    else: return jsonify({"status" : "ERROR", "message" : "Request must be JSON"}), 400

#ログイン機能
@app.route("/api/login",methods=["POST"])
def login():
    if request.is_json:
        data = request.json
        mail = data.get('email')
        pwd = data.get('password')

        userData = read_data("userData.json")

        for user in userData:
            if(user.get('email') == mail):
                if(user.get('password') == hashlib.md5(pwd.encode()).hexdigest()):
                    return jsonify({"status":"SUCCESS"}), 201
                else:
                    return jsonify({"status":"MISS"}), 201
        #見つからなかったら打ち間違いor未登録
        return jsonify({"status":"NOTFOUND"}), 201
    else: return jsonify({"status":"ERROR"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)