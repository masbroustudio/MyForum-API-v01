const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const LikeComment = require("../../../Domains/likes/entities/LikeComment");
const UnlikeComment = require("../../../Domains/likes/entities/UnlikeComment");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("LikeRepositoryPostgres", () => {
	beforeEach(async () => {
		// Insert new user to users table (Owner of new thread)
		await UsersTableTestHelper.addUser({}); // id of user-123

		// Insert new thread with id of thread-123
		await ThreadsTableTestHelper.addThread({});

		// Insert new comment with id of comment-123
		await CommentsTableTestHelper.addComment({});
	});

	afterEach(async () => {
		await LikesTableTestHelper.cleanTable();
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe("likeComment function", () => {
		it("should persist like comment and ran successfully", async () => {
			// Arrange
			const likeComment = new LikeComment({
				commentId: "comment-123"
			});
			const userId = "user-123";
			const fakeIdGenerator = () => "123";
			const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

			// Action
			await likeRepositoryPostgres.likeComment(userId, likeComment);

			// Assert
			const likes = await LikesTableTestHelper.findLikeById("like-123");
			expect(likes).toHaveLength(1);
		});
	});

	describe("unlikeComment function", () => {
		it("should persist unlike comment and ran successfully", async () => {
			// Arrange
			// Insert like to comment-123
			await LikesTableTestHelper.likeComment({});

			const userId = "user-123";
			const unlikeComment = new UnlikeComment({
				likeId: "like-123",
				commentId: "comment-123"
			});
			const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

			// Action
			await likeRepositoryPostgres.unlikeComment(userId, unlikeComment);

			// Assert
			const likes = await LikesTableTestHelper.findLikeById("like-123");
			expect(likes).toHaveLength(0);
		});
	});

	describe("findLikeByCommentId function", () => {
		it("should return undefined if like is not found", async () => {
			// Arrange
			const userId = "user-123";
			const commentId = "comment-123";
			const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

			// Action
			const like = await likeRepositoryPostgres.findLikeByCommentId(userId, commentId);

			// Assert
			expect(like).toBeUndefined();
		});

		it("should return like if like with given comment id and user id is found", async () => {
			// Arrange
			// Insert like to comment-123
			await LikesTableTestHelper.likeComment({});

			const userId = "user-123";
			const commentId = "comment-123";
			const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

			// Action
			const like = await likeRepositoryPostgres.findLikeByCommentId(userId, commentId);

			// Assert
			expect(like).toEqual({
				id: "like-123",
				comment_id: commentId,
				owner: userId
			});
		});
	});
});
