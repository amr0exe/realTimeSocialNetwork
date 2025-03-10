
export interface AuthResponse {
	status: string;
	message: string;	
	token: string;
}

interface Comment {
  id: number;
  content: string;
  authorId: number;
}

export interface Post {
  id: number;
  content: string;
  authorId: number;
  author: {
		username: string;
  };
  likeCount: number;
  dislikeCount: number;
  comments: Comment[];
}
export type PostArray = Post[]

export interface PostsResponse {
  status: string;
  message: string;
  data: {
    posts: Post[];
  };
}

