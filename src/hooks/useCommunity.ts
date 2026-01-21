import { useState, useEffect, useCallback } from 'react';

interface CommunityPost {
  id: string;
  employee_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  is_repost: boolean;
  original_post_id?: string;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_title: string;
  author_avatar?: string;
  author_email: string;
  author_username?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
}

interface CommunityComment {
  id: string;
  post_id: string;
  employee_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_avatar?: string;
  author_email: string;
  author_username?: string;
}

export const useCommunity = (token: string | null) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all community posts
  const fetchPosts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create a new post
  const createPost = useCallback(async (content: string, imageUrl?: string, videoUrl?: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          image_url: imageUrl,
          video_url: videoUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Refresh posts after creating a new one
      await fetchPosts();

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchPosts]);

  // Like/unlike a post
  const likePost = useCallback(async (postId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to like post: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update the post in the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
              ...post,
              likes_count: data.data.likes_count,
              isLiked: data.data.liked
            }
            : post
        )
      );

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Bookmark/unbookmark a post
  const bookmarkPost = useCallback(async (postId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to bookmark post: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update the post in the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
              ...post,
              isBookmarked: data.data.bookmarked
            }
            : post
        )
      );

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bookmark post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Repost a post
  const repostPost = useCallback(async (postId: string, content?: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts/repost`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          content
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to repost post: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Refresh posts after reposting
      await fetchPosts();

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to repost post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchPosts]);

  // Delete a post
  const deletePost = useCallback(async (postId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status} ${response.statusText}`);
      }

      // Refresh posts after deleting
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchPosts]);

  // Create a comment on a post
  const createComment = useCallback(async (postId: string, content: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          content
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create comment: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update the post's comment count in the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
              ...post,
              comments_count: post.comments_count + 1
            }
            : post
        )
      );

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get comments for a post
  const getCommentsForPost = useCallback(async (postId: string) => {
    if (!token) return [];

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/posts/${postId}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/comments`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status} ${response.statusText}`);
      }

      // Note: The UI will need to refresh the comments list to reflect the deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost,
    bookmarkPost,
    repostPost,
    deletePost,
    createComment,
    getCommentsForPost,
    deleteComment
  };
};