"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

#LOGEAR AL USUARIO
# Crea una ruta para autenticar a los usuarios y devolver el token JWT
# La función create_access_token() se utiliza para generar el JWT
@api.route("/login", methods=["POST"])
def create_token_to_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Consulta la base de datos por el nombre de usuario y la contraseña
    user = User.query.filter_by(email = email, password=password).first()
    if user is None:
        # el usuario no se encontró en la base de datos
        return jsonify({"msg": "Bad username or password"}), 401
    # Crea un nuevo token con el id de usuario dentro
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })

#CONSULTAR TODOS LOS USERS
@api.route('/user', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user:
            result = User.query.filter_by(id=current_user_id).first()
            response_body = {
                "msg": "Ok",
                "results": result.serialize()
            }
            return jsonify(response_body), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
#CREA UN NUEVO USUARIO
@api.route("/user", methods=["POST"])
def create_new_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    try:
        # Consulta la base de datos por el nombre de usuario y la contraseña
        user = User.query.filter_by(email = email, password=password).first()
        if user:
            return jsonify({"msg": "El email ya fue registrado"}), 400
        user_created = User(email = email, password = password, is_active = True)
        db.session.add(user_created)
        db.session.commit()
        response_body = {
            "msg": "User created successfully",
        }
        return jsonify(response_body), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
