const UnlikeComment = require("../UnlikeComment");

describe("a UnlikeComment entities", () => {
	it("should throw error when payload did not contain needed property", () => {
		// Arrange
		const payload = {
			likeId: "like-123"
			// commentId is not provided
		};

		// Action and assert
		expect(() => new UnlikeComment(payload)).toThrowError(
			"UNLIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
		);
	});

	it("should throw error when payload did not meet data type specification", () => {
		// Arrange
		const payload = {
			likeId: 123, // invalid type, should be string
			commentId: "comment-123"
		};

		// Action and assert
		expect(() => new UnlikeComment(payload)).toThrowError(
			"UNLIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
		);
	});

	it("should create UnlikeComment object with expected props", () => {
		// Arrange
		const payload = {
			likeId: "like-123",
			commentId: "comment-123"
		};

		// Action
		const { likeId, commentId } = new UnlikeComment(payload);

		// Assert
		expect(likeId).toEqual(payload.likeId);
		expect(commentId).toEqual(payload.commentId);
	});
});
