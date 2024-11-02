CREATE TABLE IF NOT EXISTS COMMENTS (
	ID SERIAL PRIMARY KEY,
	BLOG_ID INT NOT NULL,
	FOREIGN KEY (BLOG_ID) REFERENCES BLOGS (ID),
	NAME VARCHAR(50) NOT NULL,
	EMAIL VARCHAR(300) NOT NULL,
	CONTENT VARCHAR(500),
	CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	UPDATED_AT TIMESTAMP WITH TIME ZONE,
	DELETED INT DEFAULT 0 NOT NULL,
	DELETED_AT TIMESTAMP WITH TIME ZONE,
	UNIQUE (BLOG_ID, CONTENT, DELETED)
);