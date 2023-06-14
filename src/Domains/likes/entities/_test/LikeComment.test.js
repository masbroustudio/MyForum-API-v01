const LikeComment = require("../LikeComment");

describe("a LikeComment entities", () => {
	it("should throw error when payload did not contain needed property", () => {
		// Arrange
		const payload = {
			// commentId is not provided
		};

		// Action and assert
		expect(() => new LikeComment(payload)).toThrowError("LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
	});

	it("should throw error when payload did not meet data type specification", () => {
		// Arrange
		const payload = {
			commentId: 123 // invalid type, should be string
		};

		// Action and assert
		expect(() => new LikeComment(payload)).toThrowError(
			"LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
		);
	});

	it("should create LikeComment object with expected props", () => {
		// Arrange
		const payload = {
			commentId: "comment-123"
		};

		// Action
		const { commentId } = new LikeComment(payload);

		// Assert
		expect(commentId).toEqual(payload.commentId);
	});
});
