const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const LikeComment = require("../../Domains/likes/entities/LikeComment");
const UnlikeComment = require("../../Domains/likes/entities/UnlikeComment");

class LikeCommentUseCase {
	constructor({ likeRepository, commentRepository, threadRepository }) {
		this._likeRepository = likeRepository;
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(userId, useCasePayload) {
		const { commentId, threadId } = useCasePayload;

		// Validate thread is exist
		const thread = await this._threadRepository.findThreadById(threadId);

		if (!thread) {
			throw new NotFoundError(`Thread dengan id '${threadId}' tidak ditemukan!`);
		}

		// Validate comment exist
		const comment = await this._commentRepository.findCommentById(commentId, threadId);

		if (!comment) {
			throw new NotFoundError(
				`Komentar dengan id '${commentId}' pada id thread '${threadId}' tidak ditemukan!`
			);
		}

		// Decide action is either 'like' or 'unlike'
		const existingLike = await this._likeRepository.findLikeByCommentId(userId, commentId);

		if (existingLike) {
			// Action is 'like'
			const unlikeComment = new UnlikeComment({
				likeId: existingLike.id,
				commentId
			});

			await this._likeRepository.unlikeComment(userId, unlikeComment);
		} else {
			// Action is 'unlike'
			const likeComment = new LikeComment({
				commentId
			});

			await this._likeRepository.likeComment(userId, likeComment);
		}
	}
}

module.exports = LikeCommentUseCase;
