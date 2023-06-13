const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeComment = require("../../../Domains/likes/entities/LikeComment");
const UnlikeComment = require("../../../Domains/likes/entities/UnlikeComment");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeCommentUseCase = require("../LikeCommentUseCase");

describe("LikeCommentUseCase", () => {
	it("should orchestrating the like comment action correctly", async () => {
		// Arrange
		const useCasePayload = {
			threadId: "thread-123",
			commentId: "comment-123"
		};
		const userId = "user-123";
		const mockThread = {
			id: useCasePayload.threadId,
			owner: userId
		};
		const mockComment = {
			id: useCasePayload.commentId,
			owner: userId
		};

		// Create dependency of use case
		const mockLikeRepository = new LikeRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mock needed function
		mockThreadRepository.findThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockThread));

		mockCommentRepository.findCommentById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockComment));

		mockLikeRepository.findLikeByCommentId = jest
			.fn()
			.mockImplementation(() => Promise.resolve(undefined));
		mockLikeRepository.likeComment = jest.fn().mockImplementation(() => Promise.resolve());

		// Create use case instance
		const likeCommentUseCase = new LikeCommentUseCase({
			likeRepository: mockLikeRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository
		});

		// Action
		await likeCommentUseCase.execute(userId, useCasePayload);

		// Assert
		expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);

		expect(mockCommentRepository.findCommentById).toBeCalledWith(
			useCasePayload.commentId,
			useCasePayload.threadId
		);

		expect(mockLikeRepository.findLikeByCommentId).toBeCalledWith(userId, useCasePayload.commentId);

		expect(mockLikeRepository.likeComment).toBeCalledWith(
			userId,
			new LikeComment({
				commentId: useCasePayload.commentId
			})
		);
	});

	it("should orchestrating the unlike comment action correctly", async () => {
		// Arrange
		const useCasePayload = {
			threadId: "thread-123",
			commentId: "comment-123"
		};
		const userId = "user-123";
		const likeId = "like-123";
		const mockThread = {
			id: useCasePayload.threadId,
			owner: userId
		};
		const mockComment = {
			id: useCasePayload.commentId,
			owner: userId
		};
		const mockLike = {
			id: likeId,
			comment_id: useCasePayload.commentId,
			owner: userId
		};

		// Create dependency of use case
		const mockLikeRepository = new LikeRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mock needed function
		mockThreadRepository.findThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockThread));

		mockCommentRepository.findCommentById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockComment));

		mockLikeRepository.findLikeByCommentId = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockLike));
		mockLikeRepository.unlikeComment = jest.fn().mockImplementation(() => Promise.resolve());

		// Create use case instance
		const likeCommentUseCase = new LikeCommentUseCase({
			likeRepository: mockLikeRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository
		});

		// Action
		await likeCommentUseCase.execute(userId, useCasePayload);

		// Assert
		expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);

		expect(mockCommentRepository.findCommentById).toBeCalledWith(
			useCasePayload.commentId,
			useCasePayload.threadId
		);

		expect(mockLikeRepository.findLikeByCommentId).toBeCalledWith(userId, useCasePayload.commentId);

		expect(mockLikeRepository.unlikeComment).toBeCalledWith(
			userId,
			new UnlikeComment({
				likeId: likeId,
				commentId: useCasePayload.commentId
			})
		);
	});

	it("should throw not found error if thread is not found on like or unlike comment", async () => {
		// Arrange
		const useCasePayload = {
			threadId: "thread-456", // not existing thread id
			commentId: "comment-123"
		};
		const userId = "user-123";

		// Create dependency of use case
		const mockLikeRepository = new LikeRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mock needed function
		mockThreadRepository.findThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(undefined));

		// Create use case instance
		const likeCommentUseCase = new LikeCommentUseCase({
			likeRepository: mockLikeRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository
		});

		// Action and assert
		await expect(likeCommentUseCase.execute(userId, useCasePayload)).rejects.toThrowError(
			`Thread dengan id '${useCasePayload.threadId}' tidak ditemukan!`
		);

		expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
	});

	it("should throw not found error if comment is not found on like or unlike comment", async () => {
		// Arrange
		const useCasePayload = {
			threadId: "thread-123",
			commentId: "comment-456" // not existing comment id
		};
		const userId = "user-123";
		const mockThread = {
			id: useCasePayload.threadId,
			owner: userId
		};

		// Create dependency of use case
		const mockLikeRepository = new LikeRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mock needed function
		mockThreadRepository.findThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockThread));

		mockCommentRepository.findCommentById = jest
			.fn()
			.mockImplementation(() => Promise.resolve(undefined));

		// Create use case instance
		const likeCommentUseCase = new LikeCommentUseCase({
			likeRepository: mockLikeRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository
		});

		// Action and assert
		await expect(likeCommentUseCase.execute(userId, useCasePayload)).rejects.toThrowError(
			`Komentar dengan id '${useCasePayload.commentId}' pada id thread '${useCasePayload.threadId}' tidak ditemukan!`
		);

		expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);

		expect(mockCommentRepository.findCommentById).toBeCalledWith(
			useCasePayload.commentId,
			useCasePayload.threadId
		);
	});
});
