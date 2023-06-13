/* eslint-disable camelcase */
exports.up = pgm => {
	pgm.createTable("likes", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true
		},
		comment_id: {
			type: "VARCHAR(50)",
			notNull: true
		},
		owner: {
			type: "VARCHAR(50)",
			notNull: true
		}
	});

	pgm.addConstraint(
		"likes",
		"fk_likes.comment_id_and_comments.id",
		"FOREIGN KEY(comment_id) REFERENCES comments(id)"
	);

	pgm.addConstraint(
		"likes",
		"fk_likes.owner_and_users.id",
		"FOREIGN KEY(owner) REFERENCES users(id)"
	);
};

exports.down = pgm => {
	pgm.dropTable("likes");
};
