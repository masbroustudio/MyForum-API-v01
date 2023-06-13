const LikeCommentUseCase = require("../../../../Applications/use_case/LikeCommentUseCase");

class LikeHandler {
	constructor(container) {
		this._container = container;

		this.postLikeCommentHandler = this.postLikeCommentHandler.bind(this);
	}

	async postLikeCommentHandler(request, h) {
		const { id: userId } = request.auth.credentials;

		const { threadId, commentId } = request.params;
		const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

		await likeCommentUseCase.execute(userId, {
			commentId,
			threadId
		});

		const response = h.response({
			status: "success"
		});
		return response;
	}
}

module.exports = LikeHandler;
