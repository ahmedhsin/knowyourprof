#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load
"""
likes
-user_id -pk
-reivew_id -pk
-like
-unlike
"""


class Reaction(BaseModel, db.Model):
    react = db.Column(db.Boolean(), nullable=False)
    user_id = db.Column(db.String(60), db.ForeignKey(
        'user.id'), nullable=False)
    review_id = db.Column(db.String(60), db.ForeignKey(
        'review.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('user_id', 'review_id'),)

    def __repr__(self):
        return f"react : {self.react}, review_id : {self.review_id}"


class ReactionSchema(Schema):
    id = fields.Str(required=False)
    react = fields.Bool()
    user_id = fields.Str()
    review_id = fields.Str()

    @post_load
    def make_reaction(self, data, **kwargs):
        return Reaction(**data)
