from flask import Flask, render_template, request, url_for, redirect
from flask import Blueprint, jsonify, make_response
from app import db, bcrypt, session
from app import BaseModel, func
from app import User, UserSchema
from app import Prof, ProfSchema
from app import Admin, AdminSchema
from app import Review, ReviewSchema
from app import Reaction, ReactionSchema
from app import Facility, FacilitySchema
from functools import wraps


def credentials(enum):
    # 0 admin, 1 user, 2 user or admin
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            user_id = session.get('user_id', None)
            admin_id = session.get('admin_id', None)
            ok = False
            if enum == 0:
                ok = bool(admin_id)
            elif enum == 1:
                ok = bool(user_id)
            else:
                ok = bool(user_id) or bool(admin_id)
            if not ok:
                return jsonify({'error': 'Unauthorized'}), 401
            else:
                return f(*args, **kwargs)
        return wrapped
    return decorator
