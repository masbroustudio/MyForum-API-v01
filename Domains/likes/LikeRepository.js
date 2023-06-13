/* eslint-disable no-unused-vars */
class LikeRepository {
	async likeComment(userId, likeComment) {
		throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
	}

	async unlikeComment(userId, unlikeComment) {
		throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
	}

	async findLikeByCommentId(userId, commentId) {
		throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
	}
}

module.exports = LikeRepository;
