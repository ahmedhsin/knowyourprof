#!/usr/bin/python3
"""Base model for all models"""
from app import db, bcrypt, whooshee
from datetime import datetime
import uuid
from marshmallow import Schema, fields, post_load


class BaseModel():
    id = db.Column(db.String(60), primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True))

    updated_at = db.Column(db.DateTime(timezone=True))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if 'id' not in kwargs:
            self.id = str(uuid.uuid4())
        if 'created_at' not in kwargs:
            self.created_at = datetime.now()
        self.updated_at = datetime.now()
        if 'password' in kwargs:
            p = bcrypt.generate_password_hash(kwargs['password'])
            self.password = p
