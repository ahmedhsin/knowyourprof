#!/usr/bin/python3
import os
import re
from flask import Flask, render_template, Blueprint, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.sql import func
from flask_cors import CORS
from flask_whooshee import Whooshee
from sqlalchemy import event
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from datetime import timedelta

# Initialize Flask app
app = Flask(__name__)

# Configure app settings
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['WHOOSHEE_DIR'] = basedir + '/whooshee-indexing'


# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
whooshee = Whooshee(app)
app.config["JWT_SECRET_KEY"] = "XXXXXXXXXXXXXXXXXX"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

# Import models
from .api.v1.models.base_model import BaseModel
from .api.v1.models.user import User, UserSchema
from .api.v1.models.facility import Facility, FacilitySchema
from .api.v1.models.reaction import Reaction, ReactionSchema
from .api.v1.models.review import Review, ReviewSchema
from .api.v1.models.admin import Admin, AdminSchema
from .api.v1.models.prof import Prof, ProfSchema

# Preprocess function for event listeners
def preprocess(target, value, oldvalue, initiator):
    diacritic_pattern = re.compile(r'[\u064B-\u065F]')
    processed_value = diacritic_pattern.sub('', value)
    processed_value = processed_value.replace("أ", "ا")
    print(processed_value)
    target.text = processed_value

# Set up event listeners
event.listen(Prof.name, 'set', preprocess)
event.listen(Prof.department, 'set', preprocess)
event.listen(Facility.name, 'set', preprocess)
event.listen(Admin.name, 'set', preprocess)
event.listen(User.name, 'set', preprocess)

# Import and register views
from .api.v1.views import auth_view, prof_view, review_view, account_view, admin_view, reaction_view, facility_view

app.register_blueprint(prof_view.bp)
app.register_blueprint(auth_view.bp)
app.register_blueprint(review_view.bp)
app.register_blueprint(admin_view.bp)
app.register_blueprint(reaction_view.bp)
app.register_blueprint(facility_view.bp)
app.register_blueprint(account_view.bp)

# Default route
@app.route('/api')
def home():
    return "Hello World"

# This is a __init__.py file
