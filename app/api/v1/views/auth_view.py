#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response, session, request
from . import User, UserSchema, AdminSchema, Admin, bcrypt
from . import credentials
bp = Blueprint('auth', __name__, url_prefix='/auth')
userSchema = UserSchema()
adminSchema = AdminSchema()


@bp.route('/register', methods=['POST'])
@credentials(2)
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
    if session.get("user_id") or session.get("admin_id"):
        return jsonify({"error": "You are logged in"}), 401
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
    if not member:
        return jsonify({"error": "Incorrect email or password"}), 401
    if not bcrypt.check_password_hash(member.password, data['password']):
        return jsonify({"error": "Incorrect email or password"}), 401
    if role == 'user':
        session['user_id'] = member.id
    else:
        session['admin_id'] = member.id

    return jsonify({"success": "Logged in"}), 201


@bp.route('/logout', methods=['POST'])
def logout():
    if (session.get('user_id') or session.get('admin_id')):
        session.pop('user_id', None)
        session.pop('admin_id', None)
        return jsonify({"success": "Logged out"}), 200

    return jsonify({"error": "You are not logged in"}), 401
