const AuthTestHelper = require("../../../../tests/AuthTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("like comment endpoint", () => {
	beforeAll(async () => {
		// Insert new user
		await UsersTableTestHelper.addUser({}); // id of user-123
	});

	afterAll(async () => {
		await UsersTableTestHelper.cleanTable();
		await pool.end();
	});

	afterEach(async () => {
		await LikesTableTestHelper.cleanTable();
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
	});

	describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
		it("should response 200 and persist like comment if authenticated", async () => {
			// Arrange
			// Create thread and comment
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			const server = await createServer(container);
			const threadId = "thread-123";
			const commentId = "comment-123";
			const accessToken = await AuthTestHelper.getAccessToken();

			// Action
			const response = await server.inject({
				method: "PUT",
				url: `/threads/${threadId}/comments/${commentId}/likes`,
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			// Assert
			const { status } = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(status).toEqual("success");
		});

		it("should response 200 and persist unlike comment if authenticated", async () => {
			// Arrange
			// Create thread, comment, and like comment
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			await LikesTableTestHelper.likeComment({});

			const server = await createServer(container);
			const threadId = "thread-123";
			const commentId = "comment-123";
			const accessToken = await AuthTestHelper.getAccessToken();

			// Action
			const response = await server.inject({
				method: "PUT",
				url: `/threads/${threadId}/comments/${commentId}/likes`,
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			// Assert
			const { status } = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(status).toEqual("success");
		});

		it("should response 401 and error message if not authenticated", async () => {
			// Arrange
			const server = await createServer(container);
			const threadId = "thread-123";
			const commentId = "comment-123";

			// Action
			const response = await server.inject({
				method: "PUT",
				url: `/threads/${threadId}/comments/${commentId}/likes`
			});

			// Assert
			const { error, message } = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(message).toEqual("Missing authentication");
			expect(error).toEqual("Unauthorized");
		});

		it("should response 404 when thread is not found", async () => {
			// Arrange
			const server = await createServer(container);
			const threadId = "thread-456"; // not existing thread id
			const commentId = "comment-123";
			const accessToken = await AuthTestHelper.getAccessToken();

			// Action
			const response = await server.inject({
				method: "PUT",
				url: `/threads/${threadId}/comments/${commentId}/likes`,
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			// Assert
			const { status, message } = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(status).toEqual("fail");
			expect(message).toBeDefined();
		});

		it("should response 404 when comment is not found", async () => {
			// Arrange
			const server = await createServer(container);
			const threadId = "thread-123";
			const commentId = "comment-456"; // not existing comment id
			const accessToken = await AuthTestHelper.getAccessToken();

			// Action
			const response = await server.inject({
				method: "PUT",
				url: `/threads/${threadId}/comments/${commentId}/likes`,
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			// Assert
			const { status, message } = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(status).toEqual("fail");
			expect(message).toBeDefined();
		});
	});
});
