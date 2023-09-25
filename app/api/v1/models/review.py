#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load
from app import User
"""
review
-likes
-dislikes
(user_id, prof_id) -> unique
"""


class Review(BaseModel, db.Model):
    text = db.Column(db.Text(), nullable=False)
    overview = db.Column(db.String(), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String(60), db.ForeignKey(
        'user.id'), nullable=False)
    prof_id = db.Column(db.String(60), db.ForeignKey(
        'prof.id'), nullable=False)
    approved_by = db.Column(db.String(60), db.ForeignKey('admin.id'))
    reacts = db.relationship('Reaction', backref='review')
    likes = db.Column(db.Integer(), default=0)
    dislikes = db.Column(db.Integer(), default=0)
    anonymous = db.Column(db.Boolean(), default=True)

    @staticmethod
    def preview(review):
        tmp = {}
        tmp['text'] = review.text
        tmp['overview'] = review.overview
        tmp['id'] = review.id
        tmp['rating'] = review.rating
        tmp['likes'] = review.likes
        tmp['dislikes'] = review.dislikes
        tmp['created_at'] = review.created_at.strftime('%Y-%m-%d %H:%M')
        tmp['updated_at'] = review.updated_at.strftime('%Y-%m-%d %H:%M')
        tmp['prof_id'] = review.prof_id
        tmp['approved'] = (review.approved_by != None)
        if review.anonymous:
            tmp['user'] = 'anonymous'
        else:
            tmp['user'] = User.query.filter_by(id=review.user_id).first().name
        return tmp

    __table_args__ = (db.UniqueConstraint('user_id', 'prof_id'),
                      db.CheckConstraint('rating >= 1 and rating <= 5'),)

    def __repr__(self):
        return f"review id: {self.id}"


class ReviewSchema(Schema):
    id = fields.Str(required=False)
    text = fields.Str()
    overview = fields.Str()
    rating = fields.Int()
    user_id = fields.Str()
    prof_id = fields.Str()
    anonymous = fields.Bool()

    @post_load
    def make_Review(self, data, **kwargs):
        return Review(**data)
