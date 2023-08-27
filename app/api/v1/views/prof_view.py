#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import Prof, ProfSchema, FacilitySchema, Facility
from . import Review, ReviewSchema, session, request
from sqlalchemy import and_
from . import credentials, jwt_required, get_jwt_identity, getId

bp = Blueprint('profs', __name__, url_prefix='/profs')

profSchema = ProfSchema()
reviewSchemaOne = ReviewSchema()
facilitySchema = FacilitySchema(many=True)


@bp.route('/all', methods=['GET'])
def all_profs():
    Profs = Prof.query.all()
    allProfs = []
    for prof in Profs:
        if prof.approved_by:
            prof_ser = profSchema.dump(prof)
            facilites = facilitySchema.dump(prof.facilities)
            prof_ser['facilities'] = facilites
            allProfs.append(prof_ser)

    return jsonify(allProfs)


@bp.route('/filter', methods=['GET'])
def filter_profs():
    name = request.args.get('name', default=None)
    if name and len(name) < 3:
        return jsonify({"error": "Name must have at least 3 characters"}), 400
    facility = request.args.get('facility')
    page = int(request.args.get('page', default=1))
    limit = int(request.args.get('limit', default=0))

    per_page = int(request.args.get('per_page', default=10))
    if name:
        query = Prof.query.whooshee_search(name)
    else:
        query = Prof.query
    if facility:
        query = query.filter(Prof.facilities.any(name=facility))
    if not limit:
        Profs = query.paginate(page=page, per_page=per_page, error_out=False)
        hasNext = Profs.has_next
        Profs = Profs.items
    else:
        Profs = query.limit(limit).all()
    allProfs = []
    for prof in Profs:
        if prof.approved_by:
            prof_ser = profSchema.dump(prof)
            facilites = facilitySchema.dump(prof.facilities)
            prof_ser['facilities'] = facilites
            allProfs.append(prof_ser)
    if not limit:
        return jsonify({'hasNext': hasNext, 'profs': allProfs})
    else:
        return jsonify(allProfs)


@bp.route('/<string:id>', methods=['GET'])
def get_prof(id):
    professor = Prof.query.filter_by(id=id).first()
    if professor == None or not professor.approved_by:
        return jsonify({"error": "Not found"}), 404
    prof_ser = profSchema.dump(professor)
    prof_ser['facilites'] = facilitySchema.dump(professor.facilities)
    return jsonify(prof_ser)


@bp.route('/<string:id>/reviews', methods=['GET'])
def get_reviews(id):
    professor = Prof.query.filter_by(id=id).first()
    if professor == None or not professor.approved_by:
        return jsonify({"error": "Not found"}), 404

    reviews = []
    for review in professor.reviews:
        if review.approved_by:
            reviews.append(Review.preview(review))
    return jsonify(reviews)


@bp.route('/new', methods=['POST'])
@jwt_required()
@credentials(1)
def add_prof():
    data = request.get_json()
    print(data)
    if not all(key in data for key in ['name', 'facilities', 'gender']):
        return jsonify({"error": "Missing data"}), 400
    facilities = data['facilities']
    del data['facilities']
    professor = profSchema.load(data)
    for name in facilities:
        facility = Facility.query.filter_by(name=name).first()
        if facility and facility not in professor.facilities:
            professor.facilities.append(facility)

    if (len(professor.facilities) == 0):
        return jsonify({"error": "Missing data"}), 400
    db.session.add(professor)
    db.session.commit()
    return jsonify({"success": "Created"}), 201


@bp.route('/<string:id>/reviews/new', methods=['POST'])
@jwt_required()
@credentials(1)
def new_review(id):
    professor = Prof.query.filter_by(id=id).first()
    if professor == None or not professor.approved_by:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    cond = and_(Review.prof_id == id, Review.user_id == getId())
    isExist = Review.query.filter(cond).first()
    if isExist:
        return jsonify({"error": "Already reviewed"}), 409
    if not all(key in data for key in ['text', 'rating']):
        return jsonify({"error": "Missing data"}), 400
    data['user_id'] = getId()
    data['prof_id'] = id
    try:
        review = reviewSchemaOne.load(data)
    except Exception:
        return jsonify({'error': 'wrong data'}), 400
    db.session.add(review)
    db.session.commit()
    return jsonify({"success": "Created"}), 201
