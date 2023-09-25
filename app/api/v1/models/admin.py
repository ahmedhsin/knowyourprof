#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load

class Admin(BaseModel, db.Model):
    name = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    verified = db.Column(db.Boolean(), default=False, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    gender = db.Column(db.Boolean(), nullable=False)
    approved_profs = db.relationship('Prof', backref='admin', cascade="all,delete")
    approved_reviews = db.relationship('Review', backref='admin', cascade="all,delete")

    def __repr__(self):
        return f"user: {self.name}"

class AdminSchema(Schema):
    id = fields.Str(required=False)
    name = fields.Str()
    email = fields.Email()
    password = fields.Str()
    gender = fields.Bool()

    @post_load
    def make_admin(self, data, **kwargs):
        return Admin(**data)
