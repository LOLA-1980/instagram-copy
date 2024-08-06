"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Post, PostLikes
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)
    
    if body is None:
        return jsonify({'msg': 'body is empty'}), 400
    required_fields = ['avatar', 'name', 'surname', 'username', 'password']
    for field in required_fields:
        if field not in body:
            return jsonify({'msg': f'field {field} is required'}), 400

    new_user = User()
    new_user.avatar = body['avatar']
    new_user.name = body['name']
    new_user.surname = body['surname']
    new_user.username = body['username']
    new_user.password = body['password']  # Contraseña almacenada sin hash
    new_user.is_active = True

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'User created'}), 201


@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    
    if body is None:
        return jsonify({'msg': 'body is empty'}), 400
    if 'username' not in body:
        return jsonify({'msg': 'field username is required'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'field password is required'}), 400
    
    user = User.query.filter_by(username=body['username']).first()
    if user is None:
        return jsonify({"msg": "user or password invalid"}), 400
    
    if user.password != body['password']:
        return jsonify({"msg": "user or password invalid"}), 400
    
    return jsonify({'msg': 'ok'}), 200



@app.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([post.serialize() for post in posts]), 200


@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    
    # Verificar si el author_id existe en la base de datos
    author = User.query.get(data['author_id'])
    if not author:
        return jsonify({"msg": "Author not found"}), 404
    
    post = Post(
        image=data['image'],
        message=data['message'],
        location=data['location'],
        status=data['status'],
        author_id=data['author_id']
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.serialize()), 201



@app.route('/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    post = Post.query.get_or_404(post_id)
    user = User.query.get_or_404(1)  # Esto debería ser dinámico, depende del usuario autenticado
    post.likes.append(user)
    db.session.commit()
    return jsonify(post.serialize()), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
