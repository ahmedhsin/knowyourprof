#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load
"""

"""
prof_facility_association = db.Table(
    'prof_facility_association',
    db.Column('prof_id', db.Integer, db.ForeignKey('prof.id')),
    db.Column('facility_id', db.Integer, db.ForeignKey('facility.id'))
)


class Prof(BaseModel, db.Model):
    name = db.Column(db.String(60), nullable=False)
    approved_by = db.Column(db.String(60), db.ForeignKey('admin.id'))
    department = db.Column(db.String(60))
    gender = db.Column(db.Boolean(), nullable=False)
    reviews = db.relationship('Review', backref='prof', cascade="all,delete")
    total_review_stars = db.Column(db.Float, default=0.0)
    facilities = db.relationship(
        'Facility', secondary=prof_facility_association, back_populates='profs')

    def __repr__(self):
        return f"prof {self.name}"


class ProfSchema(Schema):
    id = fields.Str(required=False)
    name = fields.Str()
    department = fields.Str()
    gender = fields.Bool()

    @post_load
    def make_prof(self, data, **kwargs):
        return Prof(**data)
