from flask import Flask, render_template, request, url_for, redirect
from flask import Blueprint, jsonify, make_response
from app import db, bcrypt
from app import BaseModel, func
from app import User, UserSchema
from app import Prof, ProfSchema
from app import Admin, AdminSchema
from app import Review, ReviewSchema
from app import Reaction, ReactionSchema
from app import Facility, FacilitySchema
from functools import wraps
from app import jwt_required, get_jwt_identity, create_access_token


def getId():

    return get_jwt_identity()['id']


def credentials(enum):
    # 0 admin, 1 user, 2 user or admin
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            identity = get_jwt_identity()
            role = identity['role']
            ok = False
            if enum == 0:
                ok = (role == 'admin')
            elif enum == 1:
                ok = (role == 'user')
            else:
                ok = (role == 'admin') or (role == 'user')
            if not ok:
                return jsonify({'error': 'Forbidden'}), 403
            else:
                return f(*args, **kwargs)
        return wrapped
    return decorator
