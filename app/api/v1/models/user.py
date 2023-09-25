#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load
"""
user
-id -pk
-name
-email
-verifyed
-passwd
-moderator
"""


class User(BaseModel, db.Model):
    name = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    verified = db.Column(db.Boolean(), default=False, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    gender = db.Column(db.Boolean(), nullable=False)
    reviews = db.relationship('Review', backref='user',
                              cascade="all,delete")
    reacts = db.relationship('Reaction', backref='user',
                             cascade="all,delete")

    def __repr__(self):
        return f"user: {self.name}, email: {self.email}"


class UserSchema(Schema):
    id = fields.Str(required=False)
    name = fields.Str()
    email = fields.Email()
    password = fields.Str()
    gender = fields.Bool()

    @post_load
    def make_user(self, data, **kwargs):
        return User(**data)
