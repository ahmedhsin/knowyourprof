#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import Review, ReviewSchema, session, request
from . import Admin, Prof, ProfSchema
from . import credentials

bp = Blueprint('admin', __name__, url_prefix='/admin')
profSchema = ProfSchema()


@bp.route('/reviews/pending', methods=['GET'])
@credentials(0)
def pending_reviews():
    reviews = []
    for review in Review.query.all():
        if review.approved_by == None:
            reviews.append(Review.preview(review))

    return jsonify(reviews), 200


@bp.route('/reviews/<string:id>/approve', methods=['POST'])
@credentials(0)
def approve(id):
    review = Review.query.filter_by(id=id).first()
    if not review:
        return jsonify({"error": "Not found"}), 404
    if review.approved_by:
        return jsonify({"error": "Already approved"}), 409
    review.approved_by = session.get('admin_id')
    return jsonify({"success": "Approved"}), 200


@bp.route('/reviews/<string:id>/reject', methods=['POST'])
@credentials(0)
def reject(id):

    review = Review.query.filter_by(id=id).first()
    if not review:
        return jsonify({"error": "Not found"}), 404
    if review.approved_by:
        return jsonify({"error": "Already approved"}), 409
    db.session.delete(review)
    db.session.commit()
    return jsonify({"success": "Rejected"}), 200


@bp.route('/reviews/approved/all', methods=['GET'])
@credentials(0)
def get_approved():
    reviews = []
    admin = Admin.query.filter_by(id=session.get('admin_id')).first()
    for review in admin.approved_reviews:
        if review.approved_by == session.get('admin_id'):
            tmp = Review.preview(review)
            tmp['approved_by'] = admin.name
            reviews.append(tmp)

    return jsonify(reviews), 200

# ==========================prof=====================


@bp.route('/profs/pending', methods=['GET'])
@credentials(0)
def pending_profs():

    profs = []
    for prof in Prof.query.all():
        if prof.approved_by == None:
            profs.append(profSchema.dump(prof))

    return jsonify(profs), 200


@bp.route('/profs/<string:id>/approve', methods=['POST'])
@credentials(0)
def approve_prof(id):
    prof = Prof.query.filter_by(id=id).first()
    if not prof:
        return jsonify({"error": "Not found"}), 404
    if prof.approved_by:
        return jsonify({"error": "Already approved"}), 409
    prof.approved_by = session.get('admin_id')
    return jsonify({"success": "Approved"}), 200


@bp.route('/profs/<string:id>/reject', methods=['POST'])
@credentials(0)
def reject_prof(id):

    prof = Prof.query.filter_by(id=id).first()
    if not prof:
        return jsonify({"error": "Not found"}), 404
    if prof.approved_by:
        return jsonify({"error": "Already approved"}), 409
    db.session.delete(prof)
    db.session.commit()
    return jsonify({"success": "Rejected"}), 200


@bp.route('/profs/approved/all', methods=['GET'])
@credentials(0)
def get_approved_profs():
    profs = []
    admin = Admin.query.filter_by(id=session.get('admin_id')).first()
    for prof in admin.approved_profs:
        if prof.approved_by != None:
            tmp = profSchema.dump(prof)
            tmp['approved_by'] = admin.name
            profs.append(tmp)

    return jsonify(profs), 200
