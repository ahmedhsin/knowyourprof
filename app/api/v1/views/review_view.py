#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import Review, ReviewSchema, request, Prof
from . import credentials, jwt_required, get_jwt_identity, getId
from datetime import datetime
bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')
reviewSchema = ReviewSchema()


@bp.route('/all', methods=['GET'])
def all_reviews():
    reviews = []
    for review in Review.query.all():
        if review.approved_by:
            reviews.append(Review.preview(review))
    return jsonify(reviews)


@bp.route('/<string:id>', methods=['GET'])
def get_review(id):
    review = Review.query.filter_by(id=id).first()
    if not review or not review.approved_by:
        return jsonify({"error": "Not found"}), 404

    return jsonify(Review.preview(review)), 200


@bp.route('/<string:id>', methods=['PUT', 'DELETE'])
@jwt_required()
@credentials(1)
def manpulate_review(id):
    review = Review.query.filter_by(id=id).first()
    if (review.user_id != getId()):
        return jsonify({'error': 'Unauthorized'}), 401
    professor = Prof.query.filter_by(id=review.prof_id).first()
    if not review:
        return jsonify({"error": "Not found"}), 404
    if request.method == 'DELETE':
        if review.approved_by:
            professor.total_review_stars -= review.rating
        db.session.delete(review)
        db.session.commit()
        return jsonify({"success": "Deleted"}), 200
    else:
        data = request.get_json()
        if review.approved_by:
            professor.total_review_stars -= review.rating
        if data.get('text'):
            review.text = data.get('text')
        if data.get('rating'):
            review.rating = data.get('rating')
        if data.get('overview'):
            review.overview = data.get('overview')
        if data.get('anonymous') != None:
            review.anonymous = data.get('anonymous')
        review.approved_by = None
        db.session.commit()
    review.updated_at = datetime.now()
    return jsonify({"success": "updated"}), 200
