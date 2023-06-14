class UnlikeComment {
	constructor(payload) {
		this._verifyPayload(payload);

		const { commentId, likeId } = payload;

		this.likeId = likeId;
		this.commentId = commentId;
	}

	_verifyPayload(payload) {
		const { commentId, likeId } = payload;

		if (!commentId || !likeId) {
			throw new Error("UNLIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
		}

		if (typeof commentId !== "string" || typeof likeId !== "string") {
			throw new Error("UNLIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
		}
	}
}

module.exports = UnlikeComment;
