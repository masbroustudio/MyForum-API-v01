const LikeRepository = require("../LikeRepository");

describe("LikeRepository interface", () => {
	it("should throw error when invoke unimplemented method", async () => {
		// Arrange
		const likeRepository = new LikeRepository();

		// Action & assert
		await expect(likeRepository.likeComment()).rejects.toThrowError(
			"LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
		);

		await expect(likeRepository.unlikeComment()).rejects.toThrowError(
			"LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
		);

		await expect(likeRepository.findLikeByCommentId()).rejects.toThrowError(
			"LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
		);
	});
});
