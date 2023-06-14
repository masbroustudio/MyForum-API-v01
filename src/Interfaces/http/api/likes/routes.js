const routes = handler => [
	{
		method: "PUT",
		path: "/threads/{threadId}/comments/{commentId}/likes",
		handler: handler.postLikeCommentHandler,
		options: {
			auth: "forumapiv1_jwt"
		}
	}
];

module.exports = routes;
