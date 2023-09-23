#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import Prof, ProfSchema, FacilitySchema, Facility
from . import Review, ReviewSchema, request, Reaction
from sqlalchemy import and_
from . import credentials, jwt_required, get_jwt_identity, getId

bp = Blueprint('profs', __name__, url_prefix='/api/profs')

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
            facilities = facilitySchema.dump(prof.facilities)
            prof_ser['facilities'] = facilities
            prof_ser['total_reviews'] = prof.total_review_stars
            try:
                prof_ser['average_rating'] = prof.total_review_stars / \
                    len(prof.reviews)
            except Exception:
                prof_ser['average_rating'] = 0
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
            facilities = facilitySchema.dump(prof.facilities)
            prof_ser['facilities'] = facilities

            prof_ser['total_reviews'] = len(prof.reviews)
            try:
                prof_ser['average_rating'] = prof.total_review_stars / \
                    len(prof.reviews)
            except Exception:
                prof_ser['average_rating'] = 0
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
    prof_ser['facilities'] = facilitySchema.dump(professor.facilities)
    prof_ser['total_reviews'] = len(professor.reviews)

    try:
        prof_ser['average_rating'] = professor.total_review_stars / \
            len(professor.reviews)
    except Exception:
        prof_ser['average_rating'] = 0
    print(prof_ser['average_rating'])
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

    # sort the reviews
    def sorting_key(review):
        return review['likes'] + review['dislikes']
    reviews = sorted(reviews, key=sorting_key, reverse=True)

    return jsonify(reviews)


@bp.route('/new', methods=['POST'])
@jwt_required()
@credentials(1)
def add_prof():
    data = request.get_json()
    print(data)
    if not all(key in data for key in ['name', 'facility', 'gender']):
        return jsonify({"error": "Missing data"}), 400
    facility = data['facility']
    if data['gender'] == 'true':
        data['gender'] = True
    else:
        data['gender'] = False
    s_facility = Facility.query.filter_by(name=facility).first()
    if not s_facility:
        s_facility = Facility(name=facility)
    professor = Prof(name=data['name'], gender=data['gender'])
    professor.facilities.append(s_facility)

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
    if not all(key in data for key in ['text', 'rating', 'overview', 'anonymous']):
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


@bp.route('/<string:id>/reviews/react/all', methods=['GET'])
@jwt_required()
@credentials(2)
def all_reacts_ids(id):

    professor = Prof.query.filter_by(id=id).first()
    if professor == None or not professor.approved_by:
        return jsonify({"error": "Not found"}), 404

    reacts = {}
    user_id = getId()
    for review in professor.reviews:
        if review.approved_by:
            user_reaction = Reaction.query.filter_by(
                user_id=user_id, review_id=review.id).first()
            if user_reaction is not None:
                reacts[review.id] = user_reaction.react
    return jsonify(reacts)


# not used
@bp.route('/<string:id>/reviews/filter', methods=['GET'])
def filter_reviews(id):
    overview = request.args.get('overview', default=None)
    if overview and len(overview) < 3:
        return jsonify({"error": "Overview must have at least 3 characters"}), 400
    page = int(request.args.get('page', default=1))
    limit = int(request.args.get('limit', default=0))
    per_page = int(request.args.get('per_page', default=10))
    sort_by_rating = request.args.get('sort', default=None)
    if overview:
        query = Review.query.filter(
            Review.prof_id == id).whooshee_search(overview)
    else:
        query = Review.query.filter(Review.prof_id == id)
    if sort_by_rating == 'asc':
        sort_reverse = False
    else:
        sort_reverse = True
    query = query.order_by((Review.likes + Review.dislikes).desc()
                           if sort_reverse else (Review.likes + Review.dislikes).asc())
    if not limit:
        reviews = query.paginate(page=page, per_page=per_page, error_out=False)
        hasNext = reviews.has_next
        reviews = reviews.items
    else:
        reviews = query.limit(limit).all()
    allreviews = []
    for review in reviews:
        if review.approved_by:
            review_ser = Review.preview(review)
            allreviews.append(review_ser)
    if not limit:
        return jsonify({'hasNext': hasNext, 'reviews': allreviews})
    else:
        return jsonify(allreviews)
