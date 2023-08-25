#!/usr/bin/python3
from . import Blueprint, db, jsonify, make_response
from . import Review, ReviewSchema, session, request
from . import Reaction, ReactionSchema
from sqlalchemy import and_
from . import credentials

bp = Blueprint('react', __name__)
reactionSchema = ReactionSchema()


@bp.route('/reviews/<string:id>/react', methods=['POST'])
@credentials(1)
def manpulate_react(id):

    data = request.get_json()
    if 'react' not in data:
        return jsonify({"error": "Missing data"}), 400
    review = Review.query.filter_by(id=id).first()
    if not review or not review.approved_by:
        return jsonify({"error": "Not found"}), 404
    cond = and_(Reaction.review_id == id,
                Reaction.user_id == session['user_id'])
    reaction = Reaction.query.filter(cond).first()
    if reaction:
        if data['react'] == reaction.react:
            db.session.delete(reaction)
            if data['react']:
                review.likes -= 1
            else:
                review.dislikes -= 1
            return jsonify({"success": "Deleted"}), 200
        else:
            if reaction.react:
                review.likes -= 1
                review.dislikes += 1
            else:
                review.likes += 1
                review.dislikes -= 1
            reaction.react = not reaction.react

    else:
        data['user_id'] = session['user_id']
        data['review_id'] = id
        reaction = reactionSchema.load(data)
        if data['react']:
            review.likes += 1
        else:
            review.dislikes += 1
        db.session.add(reaction)
        db.session.commit()
    return jsonify({"success": "Created"}), 201


@bp.route('/reviews/<string:id>/react/count', methods=['GET'])
def all_reacts(id):

    dislikes = Reaction.query.filter_by(react=False, review_id=id).count()
    likes = Reaction.query.filter_by(react=True, review_id=id).count()
    return jsonify({
        'upvotes': likes,
        'downvotes': dislikes
    }), 200
