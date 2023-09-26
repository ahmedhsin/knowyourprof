#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load
from .prof import prof_facility_association


class Facility(BaseModel, db.Model):
    name = db.Column(db.String(60), nullable=False)
    approved_by = db.Column(db.String(60), db.ForeignKey('admin.id'))
    profs = db.relationship(
        'Prof', secondary=prof_facility_association, back_populates='facilities', cascade="all,delete")

    def __repr__(self):
        return f"Facility : {self.name}"


class FacilitySchema(Schema):
    id = fields.Str(required=False)
    name = fields.Str()

    @post_load
    def make_fac(self, data, **kwargs):
        return Facility(**data)
