class CommentDetails {
	constructor(payload, replies) {
		this._verifyPayload(payload);

		const { id, username, date, content, is_delete, like_count } = payload;

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = is_delete ? "**komentar telah dihapus**" : content;
		this.replies = replies || [];
		this.likeCount = like_count;
	}

	_verifyPayload({ id, username, date, content, is_delete, like_count }) {
		if (!id || !username || !date || !content) {
			throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
		}

		if (
			typeof id !== "string" ||
			typeof username !== "string" ||
			typeof date !== "string" ||
			typeof content !== "string" ||
			typeof is_delete !== "boolean" ||
			typeof like_count !== "number"
		) {
			throw new Error("COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION");
		}
	}
}

module.exports = CommentDetails;
