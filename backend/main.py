from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json, os, uuid
import hashlib

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
IMAGE_DIR="item_images"
os.makedirs(IMAGE_DIR, exist_ok=True)

#deta_fileに書かれた.jsonファイルの中身を読みだす
def read_user_data(data_file):
    with open(data_file, 'r', encoding = 'utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

#data_fileにdataを追加する関数(pwdはmd5でハッシュ化して文字列として保存)
def write_user_data(data_file,userData,data):
    data['password'] = hashlib.md5(data.get('password').encode()).hexdigest()
    userData.append(data)
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(userData, f, indent=4, ensure_ascii=False)

def read_items_data(data_file):
    # itemsData.json から落とし物データを読み込む
    if not os.path.exists(data_file):
        return []
    with open(data_file, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []
        
def read_admin_data(data_file):
    if not os.path.exists(data_file):
        return {}
    with open(data_file, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}
        

def write_items_data(data_file, itemsData, record):
    # 新しい落とし物レコードを追加してファイルに書き込む
    itemsData.append(record)
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(itemsData, f, indent=4, ensure_ascii=False)


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

        userData = read_user_data("userData.json")
        #データベース上の全メールアドレスを参照し，入力と一致するものを探す
        for m in userData:
            if(m.get('email') == mail) :
                #見つかったらデータベースに追加しない
                return jsonify({"status" : "FOUND", "message" : "You have already signed up!"}), 201
        #見つからなかったらデータベースに追加
        write_user_data("userData.json",userData,data)
        return jsonify({"status" : "NEW", "message" : "Signed up correctly!"}), 201
    
    else: return jsonify({"status" : "ERROR", "message" : "Request must be JSON"}), 400

#ログイン機能
@app.route("/api/login",methods=["POST"])
def login():
    if request.is_json:
        data = request.json
        mail = data.get('email')
        pwd = data.get('password')

        userData = read_user_data("userData.json")

        for user in userData:
            if(user.get('email') == mail):
                if(user.get('password') == hashlib.md5(pwd.encode()).hexdigest()):
                    return jsonify({"status":"SUCCESS"}), 201
                else:
                    return jsonify({"status":"MISS"}), 201
        #見つからなかったら打ち間違いor未登録
        return jsonify({"status":"NOTFOUND"}), 201
    else: return jsonify({"status":"ERROR"}), 400

#タグの取得用エンドポイント
@app.route("/api/get_tags", methods=["GET"])
def get_tags():
    
    with open(os.path.join('tags', 'items.json'), 'r', encoding='utf-8') as f:
        item_tags = json.load(f)
    with open(os.path.join('tags', 'colors.json'), 'r', encoding='utf-8') as f:
        color_tags = json.load(f)
    with open(os.path.join('tags', 'places.json'), 'r', encoding='utf-8') as f:
        place_tags = json.load(f)
    
    return jsonify ({
        'item_tags': item_tags,
        'color_tags': color_tags,
        'place_tags': place_tags
    }), 200


#忘れもの登録機能
@app.route('/api/new_items', methods=["POST"])
def new_items():
    files = request.files.getlist('images')
    if not files:
        return jsonify ({
            'status': 'Failed',
            'message': 'No images'
        }),400
    
    item_tags = json.loads(request.form.get('item_tags', '[]'))
    color_tags = json.loads(request.form.get('color_tags', '[]'))
    place_tags = json.loads(request.form.get('place_tags', '[]'))
    email = request.form.get('email', '')
    other = request.form.get('other', '[]')
    found_date = request.form.get('found_date', '[]')
    found_period = request.form.get('found_period', '[]')
    found_time = request.form.get('found_time', '[]')

    if email == '':
        return jsonify ({
            'status': 'Failed',
            'message': 'No email'
        }),400
    item_id = uuid.uuid4().hex
    item_dir = os.path.join(IMAGE_DIR, item_id)
    os.makedirs(item_dir, exist_ok=True)

    #画像保存処理
    saved_filenames = []
    for f in files:
        ext = f.filename.rsplit('.',1)[-1].lower()
        if ext not in ('png', 'jpg', 'jpeg', 'heic'):
            continue
        #安全な名前+UUID
        secure_name = secure_filename(f.filename)
        unique_name = f"{uuid.uuid4().hex}_{secure_name}"
        f.save(os.path.join(item_dir, unique_name))
        saved_filenames.append(os.path.join(item_id, unique_name))
    
    record = {
        "item_id": item_id,
        "email": email,
        "tags": {
            "items": item_tags,
            "color": color_tags,
            "place": place_tags
        },
        "images": saved_filenames,
        "other": other,
        "found_date": found_date,
        "found_period": found_period,
        "found_time": found_time,
        "status": 'found'
    }

    write_items_data("itemsData.json", read_items_data("itemsData.json"), record)

    return jsonify({
        "status": 'Success',
        'email': email,
        'item_id': item_id
    }), 201

#管理者用画面ログイン
@app.route('/api/admin_login', methods=["POST"])
def admin_login():
    data = request.get_json()
    id = data.get('id', '')
    password = data.get('pwd', '')
    admin_data = read_admin_data("admin.json")
    expected_id = admin_data.get('id', '')
    expected_pwd = admin_data.get('password', '')
    if id == expected_id and password == expected_pwd:
        return jsonify ({
            'status': 'Success',
        }), 200
    else:
        return jsonify({
            "status":'Failed',
            "message": "Invalid access"
        }), 401
    
#落とし物検索機能
@app.route('/api/search_items', methods=['POST'])
def search_items():
    if request.is_json():
        data = request.json
        search_item = data.get('item_tags')
        search_color = data.get('color_tags')
        search_place = data.get('place_tags')
        itemsData = read_items_data('itemsData.json')
        res = [] #タグ一致数管理配列
        for iD in itemsData:
            item_id = iD.get('item_id')
            res[item_id] = 0
            iD_tags = iD.get('tags')
            iD_item = iD_tags.get('item')
            iD_color = iD_tags.get('color')
            iD_place = iD_tags.get('place')
            #itemタグの一致数を取得．重みを付けて記録
            for si in search_item:
                for i in iD_item:
                    if si == i: res[item_id] += 10000
            #colorタグの一致数を取得．重みをつけて記録
            for sc in search_color:
                for c in iD_color:
                    if sc == c: res[item_id] += 100
            #placeタグの一致数を取得．重みを付けて記録
            for sp in search_place:
                for p in iD_place:
                    if sp == p: res[item_id] += 1
        #重みで降順にソート
        sorted_res = sorted(res.items(), key=lambda x:x[1], reverse=True)
        return jsonify(sorted_res),201

    else :return jsonify({'status':'ERROR'}),400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)