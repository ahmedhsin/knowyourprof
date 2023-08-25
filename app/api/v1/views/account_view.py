#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response, session, request
from . import User, UserSchema, bcrypt, Review, AdminSchema, Admin
from . import credentials
bp = Blueprint('account', __name__, url_prefix='/account')
userSchema = UserSchema()
adminSchema = AdminSchema()

@bp.route('/user', methods=['GET'])
@credentials(1)
def info():
    user = User.query.filter_by(id=session.get('user_id')).first()
    print(user)
    data = userSchema.dump(user);
    del data['password']
    return jsonify(data), 200

@bp.route('/admin', methods=['GET'])
@credentials(0)
def info_admin():
    admin = Admin.query.filter_by(id=session.get('admin_id')).first()
    print(admin)
    data = adminSchema.dump(admin);
    del data['password']
    return jsonify(data), 200

@bp.route('/reviews', methods=['GET'])
@credentials(1)
def reviews():
    user = User.query.filter_by(id=session.get('user_id')).first()
    reviews = []
    for review in user.reviews:
        reviews.append(Review.preview(review))
    return jsonify(reviews), 200