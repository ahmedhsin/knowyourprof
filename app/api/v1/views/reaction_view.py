#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import Review, ReviewSchema, request
from . import Reaction, ReactionSchema
from sqlalchemy import and_
from . import credentials, jwt_required, get_jwt_identity, getId


bp = Blueprint('react', __name__, url_prefix="/api/")
reactionSchema = ReactionSchema()


@bp.route('/reviews/<string:id>/react', methods=['POST'])
@jwt_required()
@credentials(2)
def manpulate_react(id):

    data = request.get_json()
    if 'react' not in data:
        return jsonify({"error": "Missing data"}), 400
    review = Review.query.filter_by(id=id).first()
    if not review or not review.approved_by:
        return jsonify({"error": "Not found"}), 404
    cond = and_(Reaction.review_id == id,
                Reaction.user_id == getId())
    reaction = Reaction.query.filter(cond).first()
    if reaction:
        if data['react'] == reaction.react:
            db.session.delete(reaction)
            if data['react']:
                review.likes -= 1
            else:
                review.dislikes -= 1
            db.session.commit()
            print("deleted")
            return jsonify({"success": "Deleted"}), 200
        else:
            if reaction.react:
                review.likes -= 1
                review.dislikes += 1
            else:
                review.likes += 1
                review.dislikes -= 1
            reaction.react = not reaction.react
            print("updated")
            db.session.commit()
            return jsonify({"success": "Updated"}), 201

    else:
        data['user_id'] = getId()
        data['review_id'] = id
        reaction = reactionSchema.load(data)
        if data['react']:
            review.likes += 1
        else:
            review.dislikes += 1
        db.session.add(reaction)
        db.session.commit()
    print("added")
    return jsonify({"success": "Created"}), 201


@bp.route('/reviews/<string:id>/react/count', methods=['GET'])
def all_reacts(id):

    dislikes = Reaction.query.filter_by(react=False, review_id=id).count()
    likes = Reaction.query.filter_by(react=True, review_id=id).count()
    return jsonify({
        'upvotes': likes,
        'downvotes': dislikes
    }), 200
