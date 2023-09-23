#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import FacilitySchema, Facility
from . import Review, ReviewSchema, request
from sqlalchemy import and_
facilitySchema = FacilitySchema()

bp = Blueprint('facilities', __name__, url_prefix='/api/facilities')


@bp.route('/all', methods=['GET'])
def all_fa():
    facilities = Facility.query.all()
    allFacilities = []
    for facility in facilities:
        facility_ser = facilitySchema.dump(facility)
        allFacilities.append(facility_ser)
    return jsonify(allFacilities)


@bp.route('/filter', methods=['GET'])
def filter_fa():
    name = request.args.get('name', default=None)
    if name and len(name) < 3:
        return jsonify({"error": "Name must have at least 3 characters"}), 400
    page = int(request.args.get('page', default=1))
    limit = int(request.args.get('limit', default=0))
    per_page = int(request.args.get('per_page', default=10))
    if name:
        query = Facility.query.filter(Facility.name.like(f'%{name}%')).all()
    else:
        query = Facility.query
    if not limit:
        Facilities = query.paginate(
            page=page, per_page=per_page, error_out=False)
        hasNext = Facilities.has_next
        Facilities = Facilities.items
    else:
        Facilities = query.limit(limit).all()
    allFacilities = []
    for facility in Facilities:
        facility_ser = facilitySchema.dump(facility)
        allFacilities.append(facility_ser)
    if not limit:
        return jsonify({'hasNext': hasNext, 'allFacilities': allFacilities})
    else:
        return jsonify(allFacilities)
