#!/usr/bin/python3

from .base_model import BaseModel, db, Schema, fields, post_load, whooshee
from .prof import prof_facility_association


@whooshee.register_model('name')
class Facility(BaseModel, db.Model):
    name = db.Column(db.String(60), nullable=False)
    profs = db.relationship(
        'Prof', secondary=prof_facility_association, back_populates='facilities')

    def __repr__(self):
        return f"Facility : {self.name}"


class FacilitySchema(Schema):
    id = fields.Str(required=False)
    name = fields.Str()

    @post_load
    def make_fac(self, data, **kwargs):
        return Facility(**data)
