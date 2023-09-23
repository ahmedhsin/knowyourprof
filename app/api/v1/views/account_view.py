#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response, request
from . import User, UserSchema, bcrypt, Review, AdminSchema, Admin
from . import credentials, jwt_required, get_jwt_identity, getId

bp = Blueprint('account', __name__, url_prefix='/api/account')
userSchema = UserSchema()
adminSchema = AdminSchema()


@bp.route('/user', methods=['GET'])
@jwt_required()
@credentials(1)
def info():
    user = User.query.filter_by(id=getId()).first()
    print(user)
    data = userSchema.dump(user)
    del data['password']
    return jsonify(data), 200


@bp.route('/admin', methods=['GET'])
@jwt_required()
@credentials(0)
def info_admin():
    admin = Admin.query.filter_by(id=getId()).first()
    print(admin)
    data = adminSchema.dump(admin)
    del data['password']
    return jsonify(data), 200


@bp.route('/reviews', methods=['GET'])
@jwt_required()
@credentials(1)
def reviews():
    user = User.query.filter_by(id=getId()).first()
    reviews = []
    for review in user.reviews:
        reviews.append(Review.preview(review))
    return jsonify(reviews), 200
