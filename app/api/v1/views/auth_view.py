#!/usr/bin/python3
from . import Blueprint, db, jsonify, request
from . import User, UserSchema, AdminSchema, Admin, bcrypt
from . import create_access_token, jwt_required, get_jwt_identity
bp = Blueprint('auth', __name__, url_prefix='/auth')
userSchema = UserSchema()
adminSchema = AdminSchema()


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(key in data for key in ['email', 'password', 'name', 'type', 'gender']):
        return jsonify({"error": "Missing data"}), 400
    """check if it user or admin and change classes"""
    role = data['type']
    del data['type']
    RoleClass = User
    RoleSchema = userSchema
    if role == 'admin':
        RoleClass = Admin
        RoleSchema = adminSchema

    is_exist = RoleClass.query.filter_by(email=data['email']).first()
    if is_exist:
        return jsonify({'error': 'Email Exists'}), 409
    try:
        member = RoleSchema.load(data)
        db.session.add(member)
        db.session.commit()
    except Exception:
        return jsonify({"error": "Wrong format"}), 400
    return jsonify({"success": "Registered"}), 201


@bp.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    if not all(key in data for key in ['email', 'password', 'type']):
        return jsonify({"error": "Missing data"}), 400

    role = data['type']
    del data['type']
    RoleClass = User
    RoleSchema = userSchema

    if role == 'admin':
        RoleClass = Admin
        RoleSchema = adminSchema

    member = RoleClass.query.filter_by(email=data['email']).first()

    if not member or not bcrypt.check_password_hash(member.password, data['password']):
        return jsonify({"error": "Incorrect email or password"}), 401

    access_token = create_access_token(
        identity={'id': member.id, 'role': role})

    return jsonify({'token': access_token, 'type': role}), 200
